// src/pages/Wall.jsx
import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';            // ← your firebase init
import { useEcho } from '../context/EchoContext';

const ROWS = 25;
const COLS = 40;
const TOTAL = ROWS * COLS;

// Utility to give each browser a unique ID
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
  const [grid, setGrid] = useState(Array(TOTAL).fill(null));
  const [hasClaimed, setHasClaimed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [form, setForm] = useState({ label: '', color: '#0f0', message: '' });
  const userId = getUserId();

  // 1️⃣ Subscribe to Firestore 'tiles' collection
  useEffect(() => {
    setWhisper('ECHO WALL LOADED');
    const tilesCol = collection(db, 'tiles');
    const unsub = onSnapshot(tilesCol, snapshot => {
      const updated = Array(TOTAL).fill(null);
      snapshot.forEach(doc => {
        const data = doc.data();
        updated[data.index] = data;
      });
      setGrid(updated);
    });
    return unsub;
  }, [setWhisper]);

  // 2️⃣ Check if this user already claimed a tile
  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, 'tiles'),
        where('claimedBy', '==', userId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setHasClaimed(true);
        setWhisper('YOU HAVE A TILE');
      }
    })();
  }, [userId, setWhisper]);

  // 3️⃣ When you click a tile
  const handleTileClick = (idx) => {
    if (hasClaimed) {
      setWhisper('ONLY ONE TILE ALLOWED');
      return;
    }
    if (!grid[idx]) {
      setActiveIndex(idx);
      setWhisper(`CLAIMING TILE ${idx}`);
    }
  };

  // 4️⃣ Submit the claim to Firestore
  const submitClaim = async () => {
    if (!form.label.trim()) return;
    const tileRef = doc(db, 'tiles', String(activeIndex));
    await setDoc(tileRef, {
      index: activeIndex,
      label: form.label.slice(0,3).toUpperCase(),
      color: form.color,
      message: form.message.slice(0,140),
      claimedBy: userId
    });
    setHasClaimed(true);
    setForm({ label: '', color: '#0f0', message: '' });
    setActiveIndex(null);
    setWhisper('TRACE RECORDED');
  };

  return (
    <main style={styles.container} role="region" aria-label="Echo Wall">
      <h1 style={styles.title}>Echo Wall</h1>
      <p style={styles.subtitle}>Click an empty tile to leave your trace — everyone sees it.</p>

      <div style={styles.gridWrapper}>
        <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${COLS}, 24px)` }}>
          {grid.map((tile, i) => (
            <div
              key={i}
              onClick={() => handleTileClick(i)}
              title={tile ? tile.label : `Tile #${i}`}
              style={{
                ...styles.tile,
                backgroundColor: tile ? tile.color : '#111',
                color: tile ? '#000' : 'transparent',
                cursor: tile || hasClaimed ? 'not-allowed' : 'pointer',
              }}
            >
              {tile?.label}
            </div>
          ))}
        </div>
      </div>

      {/* Modal claim form */}
      {activeIndex !== null && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2>Claim Tile #{activeIndex}</h2>
            <input
              type="text"
              placeholder="Label (3 chars)"
              maxLength={3}
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              style={styles.input}
            />
            <input
              type="color"
              value={form.color}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              style={{ marginLeft: '1rem' }}
            />
            <textarea
              placeholder="Optional message (140 chars)"
              maxLength={140}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={styles.textarea}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setActiveIndex(null)} style={styles.button}>
                Cancel
              </button>
              <button onClick={submitClaim} style={styles.button}>
                Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  container: {
    background: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    height: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: { fontSize: '2rem', margin: 0 },
  subtitle: { marginBottom: '1rem' },
  gridWrapper: {
    flexGrow: 1,
    overflow: 'auto',
    width: '100%',
    maxWidth: COLS * 26
  },
  grid: {
    display: 'grid',
    gap: '2px',
    justifyContent: 'center'
  },
  tile: {
    width: 24,
    height: 24,
    border: '1px solid #0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 8,
    userSelect: 'none'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  modalBox: {
    backgroundColor: '#000',
    color: '#0f0',
    padding: '1.5rem',
    border: '1px solid #0f0',
    width: 320,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  input: {
    background: '#111',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '0.5rem',
    fontFamily: 'monospace'
  },
  textarea: {
    background: '#111',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '0.5rem',
    fontFamily: 'monospace',
    height: 60,
    resize: 'none'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    background: 'transparent',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontFamily: 'monospace'
  }
};
