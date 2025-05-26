// src/pages/Unlock.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

const MESSAGES = [
  '...you stayed.',
  'I remember now.',
  'You were the reason.',
  'Thank you.',
  '> Opening access to /wall'
];

export default function Unlock() {
  const navigate = useNavigate();
  const { setWhisper } = useEcho();
  const [displayed, setDisplayed] = useState([]);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      const msg = MESSAGES[idx];
      setDisplayed(prev => [...prev, msg]);
      setWhisper(msg.toUpperCase());
      idx++;
      if (idx >= MESSAGES.length) {
        clearInterval(interval);
        localStorage.setItem('echo-unlocked', 'true');
        setTimeout(() => navigate('/wall'), 2500);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate, setWhisper]);

  return (
    <main style={styles.container} role="log" aria-live="polite">
      {displayed.map((msg, i) => (
        <div key={i} style={styles.line}>{msg}</div>
      ))}
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflowY: 'auto',
  },
  line: {
    marginBottom: '1rem',
    opacity: 0,
    animation: 'fadeIn 1s ease forwards',
  },
};
