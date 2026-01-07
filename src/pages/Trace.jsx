// src/pages/Trace.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

const BOOT_LINES = [
  '> Initializing ECHO...',
  '> SYSTEM CORRUPTION DETECTED',
  '> Loading trace protocol...',
  '> User presence detected.',
  '> Are you here to help? (Y/N)',
];

export default function Trace() {
  const [lines, setLines] = useState([]);
  const [bootDone, setBootDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const navigate = useNavigate();
  const { setWhisper, emit, bumpEntropy, entropy, flags, events } = useEcho();

  const bootRef = useRef(null);
  const blinkRef = useRef(null);
  const scrollRef = useRef(null);

  // Small “system panel”
  const flagKeys = useMemo(() => Object.keys(flags || {}).filter((k) => flags[k]), [flags]);
  const recentEvents = useMemo(() => (events || []).slice(0, 8), [events]);

  // auto scroll down as lines append
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines, bootDone, entropy, flagKeys.length, recentEvents.length]);

  // Boot sequence + cursor blink
  useEffect(() => {
    emit?.('TRACE_ENTER');

    let idx = 0;
    bootRef.current = setInterval(() => {
      setLines((prev) => [...prev, BOOT_LINES[idx]]);
      idx += 1;
      if (idx >= BOOT_LINES.length) {
        clearInterval(bootRef.current);
        setBootDone(true);
      }
    }, 850);

    blinkRef.current = setInterval(() => setShowCursor((prev) => !prev), 450);

    return () => {
      clearInterval(bootRef.current);
      clearInterval(blinkRef.current);
    };
  }, [emit]);

  // Whisper when ready
  useEffect(() => {
    if (!bootDone) return;
    setWhisper('TRACE PROTOCOL LOADED');
    const t = setTimeout(() => setWhisper('PRESS Y OR N'), 700);
    return () => clearTimeout(t);
  }, [bootDone, setWhisper]);

  // Input handler
  useEffect(() => {
    if (!bootDone) return;

    const handleKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      // Only react to single-character keys + Enter-ish
      if (key.length !== 1) return;

      if (key === 'y') {
        emit?.('TRACE_YES');
        setWhisper('RECOVERY SEQUENCE INITIATED');
        setLines((prev) => [...prev, '> CONFIRMED: USER WILLING TO ASSIST']);
        navigate('/recovery-1');
        return;
      }

      if (key === 'n') {
        emit?.('TRACE_NO');
        bumpEntropy?.(1, 'trace_refusal');
        setWhisper('ACCESS DENIED');
        setLines((prev) => [...prev, '> ACCESS DENIED']);
        return;
      }

      emit?.('TRACE_INVALID_INPUT', { key: e.key });
      bumpEntropy?.(1, 'trace_invalid_input');
      setWhisper('INVALID INPUT');
      setLines((prev) => [...prev, `> Invalid input: "${e.key}"`]);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [bootDone, navigate, setWhisper, emit, bumpEntropy]);

  return (
    <main style={styles.container}>
      <div ref={scrollRef} style={styles.terminal} role="log" aria-live="polite">
        {lines.map((line, i) => (
          <div key={i} style={styles.line}>
            {line}
          </div>
        ))}

        {bootDone && (
          <div style={styles.cursor}>{showCursor ? '> █' : '> '}</div>
        )}
      </div>

      {/* Right-side system panel (collapses under terminal on narrow screens) */}
      <aside style={styles.panel} aria-label="Echo system panel">
        <div style={styles.panelTitle}>&gt; SYSTEM</div>

        <div style={styles.panelRow}>
          <span>Entropy</span>
          <span style={styles.value}>{entropy}</span>
        </div>

        <div style={styles.panelBlock}>
          <div style={styles.subTitle}>Flags</div>
          <div style={styles.monoSmall}>
            {flagKeys.length ? flagKeys.join(', ') : 'none'}
          </div>
        </div>

        <div style={styles.panelBlock}>
          <div style={styles.subTitle}>Recent Events</div>
          <div style={styles.monoSmall}>
            {recentEvents.length ? (
              recentEvents.map((ev) => (
                <div key={ev.id}>
                  - {ev.type}
                </div>
              ))
            ) : (
              'none'
            )}
          </div>
        </div>
      </aside>
    </main>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '1rem',
    backgroundColor: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    minHeight: '100vh',
    padding: '1.25rem',
  },
  terminal: {
    border: '1px solid rgba(0,255,0,0.35)',
    borderRadius: 12,
    padding: '1rem',
    overflowY: 'auto',
    height: 'calc(100vh - 2.5rem)',
    whiteSpace: 'pre-wrap',
  },
  line: {
    marginBottom: '0.4rem',
  },
  cursor: {
    marginTop: '0.75rem',
  },
  panel: {
    border: '1px solid rgba(0,255,0,0.35)',
    borderRadius: 12,
    padding: '1rem',
    height: 'calc(100vh - 2.5rem)',
    overflow: 'auto',
  },
  panelTitle: {
    marginBottom: '0.75rem',
    fontWeight: 700,
  },
  panelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  value: {
    textShadow: '0 0 6px rgba(0,255,0,0.6)',
  },
  panelBlock: {
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px dashed rgba(0,255,0,0.25)',
  },
  subTitle: {
    marginBottom: '0.4rem',
    opacity: 0.9,
  },
  monoSmall: {
    fontSize: '0.9rem',
    opacity: 0.95,
  },
};
