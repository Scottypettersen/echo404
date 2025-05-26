// src/pages/AccessDenied.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { setWhisper } = useEcho();

  // Fire the global whisper overlay on mount
  useEffect(() => {
    setWhisper('ACCESS DENIED');
  }, [setWhisper]);

  return (
    <main style={styles.container} role="alert" aria-live="assertive">
      <h1 style={styles.title}>{'> ACCESS DENIED'}</h1>
      <p style={styles.subtitle}>{'> Unauthorized memory fragment: delta'}</p>

      <div style={styles.details}>
        <p>{'✖ Terminal locked.'}</p>
        <p>{'✖ Trace halted.'}</p>
      </div>

      <div style={styles.actions}>
        <button
          style={styles.button}
          onClick={() => navigate('/')}
        >
          Return to Safe Fragment
        </button>
      </div>
    </main>
  );
}

const styles = {
  container: {
    backgroundColor: '#100',
    color: '#f00',
    fontFamily: 'monospace',
    padding: '2rem',
    minHeight: '100vh',
    textShadow: '0 0 5px #f00',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  subtitle: {
    marginBottom: '2rem',
  },
  details: {
    textAlign: 'center',
    lineHeight: '1.4',
  },
  actions: {
    marginTop: '3rem',
  },
  button: {
    background: 'transparent',
    color: '#f00',
    border: '1px solid #f00',
    padding: '0.5rem 1rem',
    fontFamily: 'monospace',
    cursor: 'pointer',
  },
};
