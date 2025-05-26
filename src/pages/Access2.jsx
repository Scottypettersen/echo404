// src/pages/Access2.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

export default function Access2() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { setWhisper } = useEcho();

  const correctPhrase = 'hello.echo';

  const checkInput = () => {
    const val = input.trim().toLowerCase();
    if (val === correctPhrase) {
      setStatus('success');
      setWhisper('SIGNAL ACCEPTED');
      timerRef.current = setTimeout(() => {
        navigate('/access-3');
      }, 1200);
    } else {
      setStatus('fail');
      setWhisper('SIGNAL NOT RECOGNIZED');
    }
  };

  // Cleanup any pending timeouts if component unmounts early
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <main
      style={{
        backgroundColor: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <p style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
        {'> ECHO: ██████████'}
      </p>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
        (Hint: It&apos;s hidden in the static…)
      </p>

      <input
        type="text"
        aria-label="Enter the magic phrase"
        value={input}
        placeholder="magic phrase"
        onChange={(e) => {
          setInput(e.target.value);
          setStatus(null);
        }}
        onKeyDown={(e) => e.key === 'Enter' && checkInput()}
        autoFocus
        style={{
          backgroundColor: '#000',
          color: '#0f0',
          border: '1px solid #0f0',
          fontFamily: 'monospace',
          padding: '0.5rem',
          width: 250,
          textAlign: 'center',
        }}
      />

      <button
        onClick={checkInput}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          fontFamily: 'monospace',
          background: 'transparent',
          color: '#0f0',
          border: '1px solid #0f0',
          cursor: 'pointer',
        }}
      >
        [submit]
      </button>

      {status === 'fail' && (
        <p style={{ color: '#f00', marginTop: '1rem' }}>
          {'> Incorrect input. Signal not recognized.'}
        </p>
      )}
      {status === 'success' && (
        <p style={{ color: '#0f0', marginTop: '1rem' }}>
          ✓ Signal accepted.
        </p>
      )}
    </main>
  );
}
