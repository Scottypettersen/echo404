// src/pages/Wall.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useEcho } from '../context/EchoContext';

const ROWS = 25;
const COLS = 40;
const TOTAL = ROWS * COLS;
const LS_KEY = 'echo-wall-tiles';

function getUserId() {
  let id = localStorage.getItem('echoUserId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('echoUserId', id);
  }
  return id;
}

export default function Wall() {
  const { setWhisper } = useEcho();
  const userId = getUserId();

  // 1) Load initial grid from localStorage (or blank)
  const [tiles, setTiles] = useState(() => {
    const stored = localStorage.getItem(LS_KEY);
    return stored
      ? JSON.parse(stored)
      : Array(TOTAL).fill(null);
  });

  // which tile *you* claimed (null = not yet)
  const [myIndex, setMyIndex] = useState(
    tiles.findIndex(t => t?.claimedBy === userId) || null
  );

  // UI state
  const [claimIdx, setClaimIdx] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [form, setForm] = useState({ label: '', color: '#0f0', message: '' });
  const labelRef = useRef();

  // Helper to persist both state & localStorage
  const applyNewTiles = updated => {
    setTiles(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  // 2) Subscribe real-time to Firestore
  useEffect(() => {
    setWhisper('ECHO WALL LOADED');
    const unsub = onSnapshot(
      collection(db, 'tiles'),
      snap => {
        // rebuild array
        const updated = Array(TOTAL).fill(null);
        let foundMine = null;

        snap.forEach(d => {
          const data = d.data();
          updated[data.index] = data;
          if (data.claimedBy === userId) {
            foundMine = data.index;
          }
        });

        applyNewTiles(updated);
        setMyIndex(foundMine);
        if (foundMine !== null) {
          setWhisper(`YOU ALREADY CLAIMED #${foundMine}`);
        }
      },
      err => {
        console.warn('Firestore subscribe failed', err);
        setWhisper('OFFLINE MODE');
      }
    );
    return () => unsub();
  }, [setWhisper, userId]);

  // 3) Click handler
  const handleClick = i => {
    const tile = tiles[i];
    if (tile) {
      setViewData({ ...tile, index: i });
      setWhisper(`VIEWING #${i}`);
      return;
    }
    if (myIndex !== null) {
      setWhisper(`ONE TILE ONLY (#${myIndex})`);
      return;
    }
    setClaimIdx(i);
    setForm({ label: '', color: '#0f0', message: '' });
    setWhisper(`CLAIMING #${i}`);
    setTimeout(() => labelRef.current?.focus(), 100);
  };

  // 4) Submit claim
  const submitClaim = async e => {
    e.preventDefault();
    if (!form.label.trim()) {
      return labelRef.current.focus();
    }

    const idx = claimIdx;
    const newTile = {
      index:     idx,
      label:     form.label.slice(0,3).toUpperCase(),
      color:     form.color,
      message:   form.message.slice(0,140),
      claimedBy: userId,
      timestamp: Date.now()
    };

    // 4a) Write to Firestore
    try {
      await setDoc(doc(db, 'tiles', String(idx)), newTile);
    } catch (err) {
      console.warn('Firestore write failed', err);
      setWhisper('SAVE FAILED — RETRY');
      return;
    }

    // 4b) Optimistically update localStorage & state
    const updated = [...tiles];
    updated[idx] = newTile;
    applyNewTiles(updated);
    setMyIndex(idx);
    setClaimIdx(null);
    setWhisper(`#${idx} CLAIMED`);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Echo Wall</h1>
      <p style={styles.subtitle}>
        Click an empty square to leave your trace — everyone sees it.
      </p>

      <div style={styles.gridWrapper}>
        <div
          style={{
            ...styles.grid,
            gridTemplateColumns: `repeat(${COLS}, ${styles.tile.width}px)`
          }}
        >
          {tiles.map((t,i) => (
            <div
              key={i}
              onClick={() => handleClick(i)}
              title={t ? `${t.label}: ${t.message}` : `Tile #${i}`}
              style={{
                ...styles.tile,
                backgroundColor: t ? t.color : '#111',
                color:           t ? '#000' : 'transparent',
                cursor:          t ? 'pointer' : (myIndex===null ? 'pointer' : 'not-allowed')
              }}
            >
              {t?.label}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Claim Modal ────────────────────────── */}
      {claimIdx !== null && (
        <div style={styles.modalOverlay}>
          <form onSubmit={submitClaim} style={styles.modalBox}>
            <h2>Claim Tile #{claimIdx}</h2>
            <input
              ref={labelRef}
              maxLength={3}
              placeholder="Label (3 chars)"
              value={form.label}
              onChange={e => setForm(f=>({ ...f, label: e.target.value }))}
              style={styles.input}
            />
            <input
              type="color"
              value={form.color}
              onChange={e=>setForm(f=>({ ...f, color: e.target.value }))}
              style={{ ...styles.input, width:'3rem', padding:0, marginLeft:'1rem' }}
            />
            <textarea
              maxLength={140}
              placeholder="Optional message (140 chars)"
              value={form.message}
              onChange={e => setForm(f=>({ ...f, message: e.target.value }))}
              style={styles.textarea}
            />
            <div style={styles.actions}>
              <button
                type="button"
                onClick={()=>setClaimIdx(null)}
                style={styles.button}
              >Cancel</button>
              <button
                type="submit"
                disabled={!form.label.trim()}
                style={styles.button}
              >Claim</button>
            </div>
          </form>
        </div>
      )}

      {/* ─── View Modal ────────────────────────── */}
      {viewData && (
        <div
          style={styles.modalOverlay}
          onClick={()=>setViewData(null)}
        >
          <div
            style={styles.modalBox}
            onClick={e=>e.stopPropagation()}
          >
            <h2>Tile #{viewData.index} — {viewData.label}</h2>
            <p><strong>Message:</strong> {viewData.message || '—'}</p>
            <p>
              <strong>By:</strong> {viewData.claimedBy === userId ? 'You' : viewData.claimedBy}
            </p>
            <button
              style={styles.button}
              onClick={()=>setViewData(null)}
            >Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  container:    { background:'#000', color:'#0f0', fontFamily:'monospace', height:'100vh', padding:'1rem', display:'flex', flexDirection:'column', alignItems:'center', overflow:'hidden' },
  title:        { margin:0, fontSize:'2rem' },
  subtitle:     { marginBottom:'1rem' },
  gridWrapper:  { flexGrow:1, overflow:'auto', width:'100%', maxWidth:COLS*26 },
  grid:         { display:'grid', gap:'2px', justifyContent:'center' },
  tile:         { width:24, height:24, border:'1px solid #0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, userSelect:'none' },
  modalOverlay: { position:'fixed', top:0,left:0,right:0,bottom:0, background:'rgba(0,0,0,0.85)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 },
  modalBox:     { background:'#000', color:'#0f0', padding:'1rem', border:'1px solid #0f0', width:'90%', maxWidth:360, display:'flex', flexDirection:'column', gap:'0.75rem' },
  input:        { background:'#111', color:'#0f0', border:'1px solid #0f0', padding:'0.5rem', fontFamily:'monospace' },
  textarea:     { background:'#111', color:'#0f0', border:'1px solid #0f0', padding:'0.5rem', fontFamily:'monospace', height:60, resize:'none' },
  actions:      { display:'flex', justifyContent:'space-between', marginTop:'0.5rem' },
  button:       { background:'transparent', color:'#0f0', border:'1px solid #0f0', padding:'0.4rem 1rem', cursor:'pointer', fontFamily:'monospace' },
};
