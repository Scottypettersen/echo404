// src/pages/Trace.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

const BOOT_LINES = [
  '> Initializing ECHO...',
  '> SYSTEM CORRUPTION DETECTED',
  '> Loading trace protocol...',
  '> User presence detected.',
  '> Are you here to help? (Y/N)'
];

export default function Trace() {
  const [lines, setLines] = useState([]);
  const [bootDone, setBootDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const navigate = useNavigate();
  const { setWhisper } = useEcho();

  const bootRef = useRef(null);
  const blinkRef = useRef(null);

  // Boot sequence and cursor blink
  useEffect(() => {
    let idx = 0;
    bootRef.current = setInterval(() => {
      setLines(prev => [...prev, BOOT_LINES[idx]]);
      idx += 1;
      if (idx >= BOOT_LINES.length) {
        clearInterval(bootRef.current);
        setBootDone(true);
      }
    }, 1000);

    blinkRef.current = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(bootRef.current);
      clearInterval(blinkRef.current);
    };
  }, []);

  // Whisper when trace protocol is ready
  useEffect(() => {
    if (bootDone) {
      setWhisper('TRACE PROTOCOL LOADED');
      const timer = setTimeout(() => setWhisper('PRESS Y OR N'), 1000);
      return () => clearTimeout(timer);
    }
  }, [bootDone, setWhisper]);

  // Handle user input after boot
  useEffect(() => {
    if (!bootDone) return;
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'y') {
        setWhisper('RECOVERY SEQUENCE INITIATED');
        navigate('/recovery-1');
      } else if (key === 'n') {
        setWhisper('ACCESS DENIED');
        setLines(prev => [...prev, '> ACCESS DENIED']);
      } else {
        setWhisper('INVALID INPUT');
        setLines(prev => [...prev, `> Invalid input: "${e.key}"`]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [bootDone, navigate, setWhisper]);

  return (
    <main style={styles.container} role="log" aria-live="polite">
      {lines.map((line, i) => (
        <div key={i} style={styles.line}>{line}</div>
      ))}
      {bootDone && (
        <div style={styles.cursor}>{showCursor ? '> █' : '> '}</div>
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
    whiteSpace: 'pre-wrap',
    overflowY: 'auto',
  },
  line: {
    marginBottom: '0.5rem'
  },
  cursor: {
    marginTop: '1rem',
    fontFamily: 'monospace'
  }
};
