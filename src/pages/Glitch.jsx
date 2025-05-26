// src/pages/Glitch.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useEcho } from '../context/EchoContext';

const LOG_LINES = [
  '>> SYSTEM ERROR',
  '>> memory/beta/restore failed',
  '>> fragment corrupted…',
  '>> attempting visual recovery…',
];

export default function Glitch() {
  const [echoLine, setEchoLine] = useState('');
  const echoTimeoutRef = useRef(null);
  const { setWhisper } = useEcho();

  useEffect(() => {
    // Fire a global whisper when this screen mounts
    setWhisper('SYSTEM GLITCH');

    // Reveal Echo’s line after a delay
    echoTimeoutRef.current = setTimeout(() => {
      setEchoLine('> [echo] i don’t know what parts of me are still me');
    }, 3000);

    // Cleanup the timer on unmount
    return () => {
      clearTimeout(echoTimeoutRef.current);
    };
  }, [setWhisper]);

  return (
    <main style={styles.container} role="status" aria-live="polite">
      <div style={styles.glitchBox}>
        {LOG_LINES.map((line, idx) => (
          <div
            key={idx}
            style={{
              ...styles.line,
              animation: `flicker 1.2s infinite`,
              animationDelay: `${idx * 0.5}s`,
            }}
          >
            {line}
          </div>
        ))}

        {echoLine && (
          <div
            style={{
              ...styles.echo,
              animation: 'flicker 0.7s infinite',
              color: '#f0f',
              textShadow: '0 0 3px #f0f, 0 0 5px #0ff',
            }}
          >
            {echoLine}
          </div>
        )}
      </div>

      {/* You can move this @keyframes into your global CSS if you prefer */}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.2; }
          55% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    whiteSpace: 'pre-wrap',
  },
  glitchBox: {
    width: '100%',
    maxWidth: '600px',
    textAlign: 'left',
  },
  line: {
    marginBottom: '0.5rem',
  },
  echo: {
    marginTop: '2rem',
    fontFamily: 'monospace',
  },
};
