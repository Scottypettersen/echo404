// src/pages/Puzzle.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

export default function Puzzle() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { setWhisper } = useEcho();

  const correct = 'brand';

  const checkAnswer = () => {
    const answer = input.trim().toLowerCase();
    if (answer === correct) {
      setStatus('success');
      setWhisper('FRAGMENT VERIFIED');
      localStorage.setItem('echo-unlocked', 'true');
      timerRef.current = setTimeout(() => {
        navigate('/wall');
      }, 1500);
    } else {
      setStatus('fail');
      setWhisper('INCORRECT FRAGMENT');
    }
  };

  // Clear any pending redirect timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

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
        justifyContent: 'center',
        alignItems: 'center',
      }}
      role="form"
      aria-labelledby="puzzle-title"
    >
      <h1 id="puzzle-title" style={{ marginBottom: '1rem' }}>
        {'> COMPLETE THE QUOTE:'}
      </h1>
      <blockquote style={{ color: '#999', margin: '1rem 0', textAlign: 'center' }}>
        “Design is the silent ambassador of your <strong>_____</strong>.” — Paul Rand
      </blockquote>

      <input
        type="text"
        aria-label="Complete the quote"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setStatus(null);
        }}
        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
        placeholder="type your answer"
        autoFocus
        style={{
          backgroundColor: '#000',
          color: '#0f0',
          border: '1px solid #0f0',
          fontFamily: 'monospace',
          padding: '0.5rem',
          width: 300,
          textAlign: 'center',
        }}
      />

      <button
        onClick={checkAnswer}
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
        <p style={{ color: '#f00', marginTop: '1rem' }} role="alert">
          {'> Incorrect.'}
        </p>
      )}
      {status === 'success' && (
        <p style={{ color: '#0f0', marginTop: '1rem' }} role="status">
          ✓ Fragment verified. Loading Wall...
        </p>
      )}
    </main>
  );
}
