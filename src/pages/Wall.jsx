// src/pages/Wall.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useEcho } from '../context/EchoContext';

const ROWS   = 25;
const COLS   = 40;
const TOTAL  = ROWS * COLS;

export default function Wall() {
  const { setWhisper } = useEcho();
  const labelRef       = useRef();

  // ── 1) Authenticated user ─────────────────────────────────
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) {
        setUser(u);
        setWhisper('AUTHENTICATED');
      } else {
        setWhisper('AUTH FAILED');
      }
    });
    return unsub;
  }, [setWhisper]);

  // ── 2) Grid + my claim index ───────────────────────────────
  const [tiles, setTiles]     = useState(null); // null = loading
  const [myIndex, setMyIndex] = useState(null);

  useEffect(() => {
    if (!user) return;            // wait for auth
    setWhisper('LOADING WALL…');
    const unsub = onSnapshot(
      collection(db, 'tiles'),
      snap => {
        const grid = Array(TOTAL).fill(null);
        let foundMine = null;
        snap.forEach(docSnap => {
          const data = docSnap.data();
          grid[data.index] = data;
          if (data.claimedBy === user.uid) {
            foundMine = data.index;
          }
        });
        setTiles(grid);
        setMyIndex(foundMine);
        setWhisper(
          foundMine !== null
            ? `YOU ALREADY CLAIMED #${foundMine}`
            : 'ECHO WALL LOADED'
        );
      },
      err => {
        console.error('Firestore subscribe failed', err);
        setWhisper('OFFLINE MODE');
        // fallback to blank grid
        setTiles(Array(TOTAL).fill(null));
      }
    );
    return unsub;
  }, [user, setWhisper]);

  // ── 3) UI state ─────────────────────────────────────────────
  const [claimIdx, setClaimIdx] = useState(null);
  const [viewTile, setViewTile] = useState(null);
  const [form, setForm]         = useState({
    label:   '',
    color:   '#0f0',
    message: ''
  });

  // ── 4) Clicking a tile ─────────────────────────────────────
  const handleTileClick = idx => {
    const t = tiles[idx];
    if (t) {
      // view existing
      setViewTile({ ...t, index: idx });
      setWhisper(`VIEWING #${idx}`);
      return;
    }
    // block if they've already claimed
    if (myIndex !== null) {
      setWhisper(`ONE TILE ONLY (#${myIndex})`);
      return;
    }
    // start claim flow
    setClaimIdx(idx);
    setForm({ label: '', color: '#0f0', message: '' });
    setWhisper(`CLAIMING #${idx}`);
    // focus input
    setTimeout(() => labelRef.current?.focus(), 100);
  };

  // ── 5) Submitting your claim ────────────────────────────────
  const submitClaim = async e => {
    e.preventDefault();
    if (!form.label.trim()) {
      labelRef.current?.focus();
      return;
    }

    const idx = claimIdx;
    const newTile = {
      index:     idx,
      label:     form.label.slice(0, 3).toUpperCase(),
      color:     form.color,
      message:   form.message.slice(0, 140),
      claimedBy: user.uid,
      timestamp: Date.now()
    };

    try {
      await setDoc(doc(db, 'tiles', String(idx)), newTile);
      setWhisper(`#${idx} CLAIMED`);
      setClaimIdx(null);
    } catch (err) {
      console.error('Save failed', err);
      setWhisper('SAVE FAILED — RETRY');
    }
  };

  // ── 6) Render loading until ready ───────────────────────────
  if (!user || tiles === null) {
    return (
      <div style={styles.loading}>
        <p>Loading…</p>
      </div>
    );
  }

  // ── 7) Main UI ──────────────────────────────────────────────
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
          {tiles.map((t, i) => (
            <div
              key={i}
              onClick={() => handleTileClick(i)}
              title={t ? `${t.label}: ${t.message}` : `Tile #${i}`}
              style={{
                ...styles.tile,
                backgroundColor: t ? t.color : '#111',
                color:           t ? '#000' : 'transparent',
                cursor:          t
                  ? 'pointer'
                  : (myIndex === null ? 'pointer' : 'not-allowed')
              }}
            >
              {t?.label}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Claim Modal ─────────────────────────── */}
      {claimIdx !== null && (
        <div style={styles.modalOverlay}>
          <form onSubmit={submitClaim} style={styles.modalBox}>
            <h2>Claim Tile #{claimIdx}</h2>
            <input
              ref={labelRef}
              maxLength={3}
              placeholder="Label (3 chars)"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              style={styles.input}
            />
            <input
              type="color"
              value={form.color}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              style={{ ...styles.input, width: '3rem', padding: 0, marginLeft: '1rem' }}
            />
            <textarea
              maxLength={140}
              placeholder="Optional message (140 chars)"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={styles.textarea}
            />
            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => setClaimIdx(null)}
                style={styles.button}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!form.label.trim()}
                style={styles.button}
              >
                Claim
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── View Modal ─────────────────────────── */}
      {viewTile && (
        <div
          style={styles.modalOverlay}
          onClick={() => setViewTile(null)}
        >
          <div
            style={styles.modalBox}
            onClick={e => e.stopPropagation()}
          >
            <h2>Tile #{viewTile.index} — {viewTile.label}</h2>
            <p><strong>Message:</strong> {viewTile.message || '—'}</p>
            <p>
              <strong>By:</strong>{' '}
              {viewTile.claimedBy === user.uid ? 'You' : viewTile.claimedBy}
            </p>
            <button
              style={styles.button}
              onClick={() => setViewTile(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  loading:       { display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#0f0', background:'#000', fontFamily:'monospace' },
  container:     { background:'#000', color:'#0f0', fontFamily:'monospace', height:'100vh', padding:'1rem', display:'flex', flexDirection:'column', alignItems:'center', overflow:'hidden' },
  title:         { margin:0, fontSize:'2rem' },
  subtitle:      { marginBottom:'1rem' },
  gridWrapper:   { flexGrow:1, overflow:'auto', width:'100%', maxWidth:COLS * 26 },
  grid:          { display:'grid', gap:'2px', justifyContent:'center' },
  tile:          { width:24, height:24, border:'1px solid #0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, userSelect:'none' },
  modalOverlay:  { position:'fixed', top:0,left:0,right:0,bottom:0, background:'rgba(0,0,0,0.85)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 },
  modalBox:      { background:'#000', color:'#0f0', padding:'1rem', border:'1px solid #0f0', width:'90%', maxWidth:360, display:'flex', flexDirection:'column', gap:'0.75rem' },
  input:         { background:'#111', color:'#0f0', border:'1px solid #0f0', padding:'0.5rem', fontFamily:'monospace' },
  textarea:      { background:'#111', color:'#0f0', border:'1px solid #0f0', padding:'0.5rem', fontFamily:'monospace', height:60, resize:'none' },
  actions:       { display:'flex', justifyContent:'space-between', marginTop:'0.5rem' },
  button:        { background:'transparent', color:'#0f0', border:'1px solid #0f0', padding:'0.4rem 1rem', cursor:'pointer', fontFamily:'monospace' }
};
