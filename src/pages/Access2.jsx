// src/pages/Access2.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

const TARGET = 'TAKE AWAY';
const MAX_WRONG = 6;

export default function Access2() {
  const { setWhisper } = useEcho();
  const navigate = useNavigate();
  const inputRef = useRef();

  // reveal state: array of '_' or letter
  const [reveal, setReveal] = useState(
    TARGET.split('').map(ch => (ch === ' ' ? ' ' : '_'))
  );
  const [wrong, setWrong] = useState(0);
  const [tried, setTried] = useState([]); // letters already guessed
  const [status, setStatus] = useState('ready'); // ready | fail | success | dead

  // focus the single-character input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleGuess = e => {
    e.preventDefault();
    const letter = e.target.letter.value.toUpperCase();
    e.target.letter.value = '';
    if (!letter.match(/^[A-Z]$/)) return;
    if (tried.includes(letter) || status !== 'ready') return;

    setTried(t => [...t, letter]);

    if (TARGET.includes(letter)) {
      // reveal all occurrences
      setReveal(r =>
        r.map((ch, i) => (TARGET[i] === letter ? letter : ch))
      );
      setWhisper(`REVEALED: ${letter}`);
    } else {
      setWrong(w => w + 1);
      setWhisper(`WRONG: ${letter}`);
      setStatus('fail');
      setTimeout(() => setStatus('ready'), 300);
    }
  };

  // watch for game end
  useEffect(() => {
    if (reveal.join('') === TARGET) {
      setStatus('success');
      setWhisper('ACCESS GRANTED');
      setTimeout(() => navigate('/access-3'), 1000);
    } else if (wrong >= MAX_WRONG) {
      setStatus('dead');
      setWhisper('SYSTEM LOCKED');
    }
  }, [reveal, wrong, setWhisper, navigate]);

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>> ECHO PUZZLE 2</h1>
      <p style={styles.subtitle}>
        Guess the letters to reveal the secret phrase.
      </p>

      <div style={styles.hangman}>
        {reveal.map((ch, i) => (
          <span key={i} style={styles.letter}>{ch}</span>
        ))}
      </div>

      {status === 'dead' ? (
        <p style={styles.dead}>Too many wrong—access denied.</p>
      ) : (
        <form onSubmit={handleGuess} style={styles.form}>
          <input
            ref={inputRef}
            name="letter"
            maxLength={1}
            disabled={status !== 'ready'}
            style={styles.input}
            autoComplete="off"
          />
          <button type="submit" style={styles.button} disabled={status!=='ready'}>
            Guess
          </button>
        </form>
      )}

      <p style={styles.info}>
        Tried: {tried.join(', ') || 'none'}<br/>
        Wrong: {wrong} / {MAX_WRONG}
      </p>

      {status === 'success' && (
        <p style={styles.success}>✓ Phrase revealed!</p>
      )}
      {status === 'fail' && (
        <p style={styles.fail}>✗ No “{tried.slice(-1)[0]}” in there.</p>
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    marginBottom: '1rem',
  },
  subtitle: {
    marginBottom: '1.5rem',
    color: '#666',
  },
  hangman: {
    display: 'flex',
    gap: '0.5rem',
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
  letter: {
    width: '1ch',
    borderBottom: '2px solid #0f0',
    textAlign: 'center'
  },
  form: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  input: {
    width: '2rem',
    fontSize: '1.5rem',
    textAlign: 'center',
    background: '#000',
    color: '#0f0',
    border: '1px solid #0f0'
  },
  button: {
    border: '1px solid #0f0',
    background: 'transparent',
    color: '#0f0',
    cursor: 'pointer'
  },
  info: { fontSize: '0.9rem', marginTop: '1rem', color: '#666' },
  success: { color: '#0f0', marginTop: '1rem' },
  fail: { color: '#f00', marginTop: '0.5rem' },
  dead: { color: '#f00', marginTop: '1rem' }
};
