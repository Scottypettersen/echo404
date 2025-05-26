// src/pages/Access.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

export default function Access() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const { setWhisper } = useEcho();
  const timerRef = useRef(null);

  const correctAnswer = 'take away';

  const checkAnswer = () => {
    const answer = input.trim().toLowerCase();
    if (answer === correctAnswer) {
      setStatus('success');
      setWhisper('ACCESS GRANTED');
      timerRef.current = setTimeout(() => {
        navigate('/access-2');
      }, 1200);
    } else {
      setStatus('fail');
      setWhisper('ACCESS DENIED');
    }
  };

  // Clean up redirect timer if user leaves before it fires
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <p style={{ marginBottom: '1rem', maxWidth: 600, textAlign: 'center' }}>
        {`> “A designer knows he has achieved perfection not when there is nothing left to add, but when there is nothing left to _______.”`}
      </p>

      <input
        type="text"
        aria-label="Type the missing word"
        value={input}
        placeholder="your answer"
        onChange={(e) => {
          setInput(e.target.value);
          setStatus(null);
        }}
        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
        style={{
          backgroundColor: '#000',
          color: '#0f0',
          border: '1px solid #0f0',
          fontFamily: 'monospace',
          padding: '0.5rem',
          width: 250,
          textAlign: 'center',
        }}
        autoFocus
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
        <p style={{ color: '#f00', marginTop: '1rem' }}>{'> ACCESS DENIED'}</p>
      )}
      {status === 'success' && (
        <p style={{ color: '#0f0', marginTop: '1rem' }}>
          ✓ ACCESS FRAGMENT VERIFIED
        </p>
      )}
    </main>
  );
}
