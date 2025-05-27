// src/pages/Access2.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

const MAGIC = 'TAKE AWAY'.split('');

export default function Access2() {
  const { setWhisper } = useEcho();
  const navigate = useNavigate();
  const inputRef = useRef();

  // raw user input (ignored for correctness)
  const [raw, setRaw] = useState('');
  // reveal state: underscores → letters
  const [reveal, setReveal] = useState(
    MAGIC.map(ch => (ch === ' ' ? ' ' : '_'))
  );
  const [status, setStatus] = useState('ready'); // 'ready' | 'fail' | 'success'
  const timer = useRef();

  const handleChange = e => {
    setRaw(e.target.value);
    setStatus('ready');

    setReveal(r => {
      const nextIdx = r.findIndex(c => c === '_');
      if (nextIdx === -1) return r;
      const copy = [...r];
      copy[nextIdx] = MAGIC[nextIdx];
      return copy;
    });
  };

  const handleSubmit = () => {
    if (reveal.join('') === MAGIC.join('')) {
      setStatus('success');
      setWhisper('ACCESS GRANTED');
      timer.current = setTimeout(() => navigate('/access-3'), 800);
    } else {
      setStatus('fail');
      setWhisper('NOT YET');
    }
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <main
      style={{
        backgroundColor: '#000',
        color:      '#0f0',
        fontFamily: 'monospace',
        height:     '100vh',
        display:    'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding:    '2rem'
      }}
    >
      <p style={{ marginBottom: '0.5rem' }}>{'> ECHO: ██████████'}</p>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        (Type anything to slowly reveal the secret…)
      </p>

      {/* Reveal bar */}
      <div
        style={{
          letterSpacing: '0.2em',
          fontSize:      '1.5rem',
          marginBottom:  '2rem',
          textShadow:    '0 0 4px #0f0',
          minWidth:      '12ch',
          textAlign:     'center',
        }}
      >
        {reveal.join('')}
      </div>

      {/* Input + submit */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <input
          ref={inputRef}
          value={raw}
          onChange={handleChange}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Type here..."
          autoFocus
          style={{
            backgroundColor: '#000',
            color:           '#0f0',
            border:          '1px solid #0f0',
            padding:         '0.5rem 1rem',
            fontFamily:      'monospace',
            width:           250,
            textAlign:       'center',
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            background:  'transparent',
            color:       '#0f0',
            border:      '1px solid #0f0',
            fontFamily:  'monospace',
            padding:     '0.5rem 1rem',
            cursor:      'pointer',
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
