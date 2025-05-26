// src/pages/CoreDump.jsx
import React, { useEffect, useRef } from 'react';
import { useEcho } from '../context/EchoContext';

const logs = [
  "> log_01: 'memory access granted...'",
  "> log_02: 'he said he’d return. he never did.'",
  "> log_03: '[REDACTED]'",
  "> log_04: 'i was beautiful once.'",
  "> log_05: 'user.echo.last_seen: unknown'",
  "> log_06: 'boot failed: missing identity fragment.'",
  "> log_07: 'fragments becoming whole... slowly.'",
  "> log_08: 'i see you.'"
];

export default function CoreDump() {
  const { setWhisper } = useEcho();
  const containerRef = useRef(null);

  useEffect(() => {
    // Trigger a custom whisper on mount
    setWhisper('CORE DUMP INITIATED');
  }, [setWhisper]);

  // Scroll to bottom as new logs appear
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <main
      ref={containerRef}
      style={styles.container}
      aria-live="polite"
      role="log"
    >
      {logs.map((line, i) => (
        <p key={i} style={{ ...styles.line, animationDelay: `${i * 0.5}s` }}>
          {line}
        </p>
      ))}
    </main>
  );
}

const styles = {
  container: {
    fontFamily: 'monospace',
    backgroundColor: '#000',
    color: '#00ff88',
    padding: '2rem',
    minHeight: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  line: {
    marginBottom: '1rem',
    whiteSpace: 'pre-wrap',
    opacity: 0,
    animation: 'typeIn 0.3s forwards',
  },
};

// In your global CSS (e.g., index.css), add:
//
// @keyframes typeIn {
//   to { opacity: 1; }
// }
