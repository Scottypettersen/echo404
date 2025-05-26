// src/pages/NotFound.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { setWhisper } = useEcho();

  // Trigger a glitch whisper when this page loads
  useEffect(() => {
    setWhisper('GLITCH DETECTED');
  }, [setWhisper]);

  return (
    <main style={styles.container} role="alert" aria-live="assertive">
      <h1 style={styles.code}>404</h1>
      <p style={styles.text}>You were looking for something else…</p>
      <p style={styles.subtle}>But you found me instead.</p>

      <div style={styles.actions}>
        <button
          style={styles.button}
          onClick={() => {
            setWhisper('RETURNING TO START');
            navigate('/');
          }}
        >
          Return Home
        </button>
      </div>

      <div
        style={styles.easterEgg}
        onClick={() => navigate('/core.dump')}
        title="echo.core.dump"
      >
        ▒▒▒ corrupted ▒▒▒
      </div>
    </main>
  );
}

const styles = {
  container: {
    fontFamily: 'monospace',
    backgroundColor: '#000',
    color: '#0f0',
    height: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
  },
  code: {
    fontSize: '4rem',
    margin: 0,
    textShadow: '0 0 5px #0f0',
  },
  text: {
    fontSize: '1.5rem',
    margin: 0,
  },
  subtle: {
    fontSize: '1rem',
    opacity: 0.6,
  },
  actions: {
    marginTop: '2rem',
  },
  button: {
    background: 'transparent',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '0.5rem 1rem',
    fontFamily: 'monospace',
    cursor: 'pointer',
  },
  easterEgg: {
    marginTop: '3rem',
    color: '#f0f',
    opacity: 0.5,
    cursor: 'pointer',
    textShadow: '0 0 5px #f0f',
    transition: 'opacity 0.3s ease',
  },
};
