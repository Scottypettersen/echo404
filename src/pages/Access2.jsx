// src/pages/Access2.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

const MAGIC = 'TAKE AWAY'.split('');

export default function Access2() {
  const { setWhisper } = useEcho();
  const navigate = useNavigate();
  const inputRef = useRef();

  // user’s raw input (we don’t actually validate its contents)
  const [inputValue, setInputValue] = useState('');
  // reveal state: start as underscores (preserving spaces)
  const [reveal, setReveal] = useState(
    MAGIC.map(ch => (ch === ' ' ? ' ' : '_'))
  );
  // feedback: 'ready' | 'fail' | 'success'
  const [status, setStatus] = useState('ready');
  const timerRef = useRef();

  // on every keystroke, advance one letter in reveal
  const handleChange = e => {
    setInputValue(e.target.value);
    setStatus('ready');
    setReveal(r => {
      const next = r.findIndex(c => c === '_');
      if (next === -1) return r;
      const copy = [...r];
      copy[next] = MAGIC[next];
      return copy;
    });
  };

  const checkSubmit = () => {
    // only succeed if we've fully revealed the phrase
    if (reveal.join('') === MAGIC.join('')) {
      setStatus('success');
      setWhisper('ACCESS GRANTED');
      timerRef.current = setTimeout(() => navigate('/access-3'), 1000);
    } else {
      setStatus('fail');
      setWhisper('NOT YET');
    }
  };

  // clean up timeout
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (
    <main
      style={{
        backgroundColor: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        height: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Static “ECHO: █████” header */}
      <p style={{ marginBottom: '0.5rem' }}>{'> ECHO: ██████████'}</p>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
        (Type anything and watch the secret phrase reveal itself…)
      </p>

      {/* The reveal bar */}
      <div
        style={{
          fontSize: '1.5rem',
          letterSpacing: '0.2em',
          textShadow: '0 0 4px #0f0',
          marginBottom: '2rem',
          minWidth: '12ch',
          textAlign: 'center',
        }}
      >
        {reveal.join('')}
      </div>

      {/* Input + submit */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={e => e.key === 'Enter' && checkSubmit()}
          placeholder="Type here…"
          autoFocus
          style={{
            backgroundColor: '#000',
            color: '#0f0',
            border: '1px solid #0f0',
            fontFamily: 'monospace',
            padding: '0.5rem 1rem',
            width: 250,
            textAlign: 'center',
          }}
        />
        <button
          onClick={checkSubmit}
          style={{
            background: 'transparent',
            color: '#0f0',
            border: '1px solid #0f0',
            fontFamily: 'monospace',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          [submit]
        </button>
      </div>

      {/* Feedback */}
      {status === 'fail' && (
        <p style={{ color: '#f00', marginTop: '1rem' }}>
          {'> Too early… keep typing.'}
        </p>
      )}
      {status === 'success' && (
        <p style={{ color: '#0f0', marginTop: '1rem' }}>✓ ACCESS GRANTED</p>
      )}
    </main>
  );
}
