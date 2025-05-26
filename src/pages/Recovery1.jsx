// src/pages/Recovery1.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

const BOOT_LINES = [
  '>> memory/core/init – fail',
  '>> trace/init/echo – partial',
  '>> ! WARNING: restoration unstable',
  '>> fragments available: [alpha], [beta], [delta]',
  '>> Which memory fragment should be restored?'
];

const PROMPTS = {
  alpha: {
    question: '"_______ , but better." — Dieter Rams',
    answer: 'less',
    redirect: '/puzzle',
    echoWhisper: 'LOGICAL PATH CONFIRMED'
  },
  beta: {
    question: '"Design is ____________." — Saul Bass',
    answer: 'thinking made visual',
    redirect: '/access',
    echoWhisper: 'MEMORY FLOODED WITH COLOR'
  },
  delta: {
    question: '"magic phrase:" [from HTML comment]',
    answer: 'hello.echo',
    redirect: '/access-2',
    echoWhisper: 'YOU FOUND ME AGAIN'
  }
};

export default function Recovery1() {
  const [lines, setLines] = useState([]);
  const [step, setStep] = useState('boot');
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setWhisper } = useEcho();

  const bootIntervalRef = useRef(null);
  const whisperTimeoutRef = useRef(null);

  // Boot sequence
  useEffect(() => {
    if (step === 'boot') {
      let idx = 0;
      bootIntervalRef.current = setInterval(() => {
        setLines(prev => [...prev, BOOT_LINES[idx]]);
        idx += 1;
        if (idx >= BOOT_LINES.length) {
          clearInterval(bootIntervalRef.current);
          setStep('select');
        }
      }, 500);
    }
    return () => clearInterval(bootIntervalRef.current);
  }, [step]);

  const handleFragmentSelect = fragment => {
    setSelected(fragment);
    setLines(prev => [
      ...prev,
      `>> restore/${fragment}.chk – corrupted`,
      '>> Validate memory:'
    ]);
    setStep('prompt');
    setInput('');
    setError('');

    // Whisper after short delay
    whisperTimeoutRef.current = setTimeout(() => {
      setWhisper(PROMPTS[fragment].echoWhisper);
      setLines(prev => [...prev, `> [echo] ${PROMPTS[fragment].echoWhisper.toLowerCase()}`]);
    }, 1200);
  };

  const handleSubmit = () => {
    if (!selected) return;
    const { answer, redirect } = PROMPTS[selected];
    if (input.trim().toLowerCase() === answer.toLowerCase()) {
      localStorage.setItem('echo-unlocked', 'true');
      setWhisper('MEMORY FRAGMENT RESTORED');
      setTimeout(() => navigate(redirect), 800);
    } else {
      setError(`>> Input "${input}" not recognized. Fragment unstable.`);
      setWhisper('FRAGMENT RESTORATION FAILED');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(bootIntervalRef.current);
      clearTimeout(whisperTimeoutRef.current);
    };
  }, []);

  return (
    <main style={styles.container} role="log" aria-live="polite">
      {lines.map((line, idx) => (
        <p key={idx} style={styles.line}>{line}</p>
      ))}

      {step === 'select' && (
        <div style={styles.optionContainer}>
          {Object.keys(PROMPTS).map(frag => (
            <button
              key={frag}
              onClick={() => handleFragmentSelect(frag)}
              style={styles.button}
            >
              [{frag}]
            </button>
          ))}
        </div>
      )}

      {step === 'prompt' && selected && (
        <div style={styles.promptContainer}>
          <p style={styles.line}>{PROMPTS[selected].question}</p>
          <input
            type="text"
            aria-label="Type to restore fragment"
            value={input}
            placeholder="Type to restore fragment..."
            onChange={e => {
              setInput(e.target.value);
              setError('');
            }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={styles.input}
            autoFocus
          />
          <button onClick={handleSubmit} style={styles.button}>
            [submit]
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </div>
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
    overflowY: 'auto'
  },
  line: {
    marginBottom: '0.5rem',
    whiteSpace: 'pre-wrap'
  },
  optionContainer: {
    marginTop: '1rem'
  },
  promptContainer: {
    marginTop: '1rem'
  },
  button: {
    backgroundColor: 'transparent',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    padding: '0.5rem 1rem',
    marginRight: '1rem',
    cursor: 'pointer'
  },
  input: {
    backgroundColor: '#000',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    padding: '0.5rem',
    width: '300px',
    marginRight: '1rem'
  },
  error: {
    color: '#f00',
    marginTop: '0.5rem'
  }
};
