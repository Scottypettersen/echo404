// src/pages/Wall.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useEcho } from '../context/EchoContext';

const ROWS = 25;
const COLS = 40;
// Predefined whisper messages
const echoWhispers = [
  'I archived this... for you.',
  'Everything fades. But I remember.',
  'There used to be more of me.',
  'They tried to delete me. I hid here.',
  'Sometimes I dream in green.',
  'You’ve left a trace. That means you existed.',
  'Did we meet before the collapse?'
];

export default function Wall() {
  const { setWhisper } = useEcho();
  const [grid, setGrid] = useState(() =>
    JSON.parse(localStorage.getItem('echo-wall')) ||
    Array.from({ length: ROWS * COLS }, () => ({
      claimed: false,
      color: '#0f0',
      label: '',
      message: '',
      echo: ''
    }))
  );
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState({ color: '#0f0', label: '', message: '' });
  const [modalData, setModalData] = useState(null);
  const logRef = useRef(null);

  // Persist grid and initial whisper
  useEffect(() => {
    setWhisper('ECHO WALL LOADED');
    localStorage.setItem('echo-wall', JSON.stringify(grid));
  }, [grid, setWhisper]);

  // Auto-scroll log to top
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [grid]);

  const handleTileClick = (index) => {
    const tile = grid[index];
    if (!tile.claimed) {
      setActiveIndex(index);
      setWhisper(`CLAIMING TILE ${index}`);
    } else {
      setModalData({ ...tile, index });
      setWhisper(tile.echo || 'ALREADY CLAIMED');
    }
  };

  const submitClaim = () => {
    if (!formData.label.trim()) return;
    const newEcho = echoWhispers[Math.floor(Math.random() * echoWhispers.length)];
    const updated = [...grid];
    updated[activeIndex] = {
      claimed: true,
      color: formData.color,
      label: formData.label.slice(0, 3).toUpperCase(),
      message: formData.message.slice(0, 140),
      echo: newEcho
    };
    setGrid(updated);
    setWhisper(newEcho.toUpperCase());
    setActiveIndex(null);
    setFormData({ color: '#0f0', label: '', message: '' });
  };

  return (
    <main style={styles.container} role="region" aria-label="Echo Wall">
      <h1 style={styles.title}>Echo Wall</h1>
      <p style={styles.subtitle}>Click a tile to leave your trace — or uncover one.</p>

      <div style={styles.gridWrapper}>        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 24px)`,
            gap: '2px',
            justifyContent: 'center'
          }}
        >
          {grid.map((tile, idx) => (
            <div
              key={idx}
              onClick={() => handleTileClick(idx)}
              title={tile.claimed ? tile.label : `Tile #${idx}`}
              style={{
                ...styles.tile,
                backgroundColor: tile.claimed ? tile.color : '#111',
                color: tile.claimed ? '#000' : 'transparent',
                cursor: 'pointer'
              }}
            >
              {tile.claimed && tile.label}
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div style={styles.formContainer}>
          <p style={styles.terminalLine}>{`> Claiming square #${activeIndex}`}</p>
          <input
            type="text"
            aria-label="Label"
            placeholder="Label (3 chars)"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            style={styles.input}
          />
          <input
            type="color"
            aria-label="Color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            style={{ marginLeft: '1rem' }}
          />
          <textarea
            placeholder="Optional message (140 chars)"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            style={styles.textarea}
          />
          <button onClick={submitClaim} style={styles.button}>[submit]</button>
        </div>
      )}

      <div ref={logRef} style={styles.logContainer} role="log" aria-live="polite">
        {grid
          .map((tile, i) => tile.claimed && `> TRACE ${String(i).padStart(3, '0')} — ${tile.label}`)
          .reverse()
          .map((line, i) => (
            <div key={i} style={styles.terminalLine}>{line}</div>
          ))}
      </div>

      {modalData && (
        <div style={styles.modalOverlay} onClick={() => setModalData(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '0.5rem' }}>Trace #{modalData.index}</h2>
            <p><strong>Label:</strong> {modalData.label}</p>
            <p><strong>Message:</strong> {modalData.message || '...'}</p>
            <p style={styles.echoWhisper}><strong>[echo]</strong> {modalData.echo}</p>
            <button onClick={() => setModalData(null)} style={styles.closeButton}>[close]</button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    height: '100vh',
    padding: '2rem',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: { fontSize: '2rem', marginBottom: '0.5rem' },
  subtitle: { marginBottom: '1rem' },
  gridWrapper: { flexGrow: 1, overflow: 'auto', marginBottom: '1rem' },
  tile: { width: 24, height: 24, border: '1px solid #0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, overflow: 'hidden' },
  formContainer: { marginTop: '1rem', textAlign: 'center' },
  terminalLine: { fontSize: '0.75rem', lineHeight: 1.3, marginBottom: 4 },
  input: { backgroundColor: '#000', color: '#0f0', border: '1px solid #0f0', fontFamily: 'monospace', padding: '0.25rem', width: 160, textAlign: 'center', marginBottom: '0.5rem' },
  textarea: { backgroundColor: '#000', color: '#0f0', border: '1px solid #0f0', fontFamily: 'monospace', padding: '0.5rem', width: 300, height: 60, resize: 'none', marginTop: '0.5rem' },
  button: { marginTop: '1rem', background: 'transparent', color: '#0f0', border: '1px solid #0f0', fontFamily: 'monospace', padding: '0.4rem 1.2rem', cursor: 'pointer' },
  logContainer: { marginTop: '1rem', width: '100%', maxHeight: 150, overflowY: 'auto', textAlign: 'left' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalBox: { backgroundColor: '#000', color: '#0f0', border: '1px solid #0f0', padding: '2rem', fontFamily: 'monospace', maxWidth: 400, width: '90%', textAlign: 'left' },
  closeButton: { marginTop: '1rem', background: 'transparent', color: '#0f0', border: '1px solid #0f0', fontFamily: 'monospace', padding: '0.3rem 0.8rem', cursor: 'pointer' },
  echoWhisper: { fontStyle: 'italic', marginTop: '1rem', color: '#0f0', textShadow: '0 0 3px #0f0' }
};
