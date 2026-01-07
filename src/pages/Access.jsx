// src/pages/Access.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';
import './Access.css';

const SECRET_PASSWORD = 'KAZANIS';
const WHISPER_DELAY = 2000;
const HINT_INTERVAL = 2500;
const LETTER_HINT_PROB = 0.6;

const CRYPTIC_WHISPERS = [
  '... the gatekeeper hums a tune...',
  '... shadows dance with secrets...',
  '... listen to the pulse of the machine...',
  '... echoes of forgotten protocols...',
  '... the first layer yields slowly...',
  '... a name etched in the static...',
  '... the key resonates...',
  '... silence holds the answer...',
];

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL'],
  ['ENTER'],
];

const PASSWORD_LETTERS = SECRET_PASSWORD.toUpperCase().split('');

function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(str) {
  return String(str || '').toUpperCase();
}

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || el.isContentEditable;
}

export default function Access() {
  const navigate = useNavigate();
  const { setWhisper, setFlag, emit, bumpEntropy } = useEcho();

  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [highlightedKey, setHighlightedKey] = useState('');
  const [hintQueue, setHintQueue] = useState(() => shuffleArray(PASSWORD_LETTERS));

  const bootTimeoutRef = useRef(null);
  const hintIntervalRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  const maxLen = useMemo(() => SECRET_PASSWORD.length, []);

  const stopHintLoop = useCallback(() => {
    clearTimeout(bootTimeoutRef.current);
    clearInterval(hintIntervalRef.current);
    bootTimeoutRef.current = null;
    hintIntervalRef.current = null;
  }, []);

  const clearFeedbackTimer = useCallback(() => {
    clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = null;
  }, []);

  const grantAccess = useCallback(
    (method = 'password') => {
      clearFeedbackTimer();
      setFeedback('ACCESS GRANTED');

      if (typeof setFlag === 'function') setFlag('ACCESS1_DONE', true);
      if (typeof emit === 'function') emit('ACCESS1_SUCCESS', { method });

      stopHintLoop();

      setTimeout(() => navigate('/access2'), 900);
    },
    [clearFeedbackTimer, emit, navigate, setFlag, stopHintLoop]
  );

  const denyAccess = useCallback(
    (attempt) => {
      clearFeedbackTimer();
      setFeedback('ACCESS DENIED');

      if (typeof emit === 'function') emit('ACCESS1_FAIL', { attempt });
      if (typeof bumpEntropy === 'function') bumpEntropy(1, 'access1_fail');

      feedbackTimeoutRef.current = setTimeout(() => setFeedback(''), 900);
    },
    [bumpEntropy, clearFeedbackTimer, emit]
  );

  const handleSubmitPassword = useCallback(() => {
    if (normalize(passwordAttempt) === normalize(SECRET_PASSWORD)) grantAccess('password');
    else denyAccess(passwordAttempt);
  }, [denyAccess, grantAccess, passwordAttempt]);

  const handleKeyboardInput = useCallback(
    (key) => {
      const upperKey = String(key).toUpperCase();

      if (upperKey === 'ENTER') {
        handleSubmitPassword();
        return;
      }

      if (upperKey === 'DEL') {
        setPasswordAttempt((prev) => prev.slice(0, -1));
        return;
      }

      setPasswordAttempt((prev) => {
        if (prev.length >= maxLen) return prev;
        return prev + upperKey;
      });

      setHighlightedKey(upperKey);
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = setTimeout(() => setHighlightedKey(''), 250);
    },
    [handleSubmitPassword, maxLen]
  );

  // Boot + hint loop (StrictMode-safe, no stale closures, no state mutation)
  useEffect(() => {
    setWhisper('INITIATE ECHO SEQUENCE...');

    stopHintLoop(); // clear before starting (StrictMode)
    clearFeedbackTimer();

    bootTimeoutRef.current = setTimeout(() => {
      hintIntervalRef.current = setInterval(() => {
        const doLetterHint = Math.random() < LETTER_HINT_PROB;

        if (!doLetterHint) {
          const idx = Math.floor(Math.random() * CRYPTIC_WHISPERS.length);
          setWhisper(CRYPTIC_WHISPERS[idx]);
          return;
        }

        setHintQueue((prev) => {
          const queue = prev.length ? [...prev] : shuffleArray(PASSWORD_LETTERS);
          const hint = queue.shift();
          setWhisper(`... ECHO: ${hint}`);
          return queue;
        });
      }, HINT_INTERVAL);
    }, WHISPER_DELAY);

    return () => {
      stopHintLoop();
      clearFeedbackTimer();
      clearTimeout(highlightTimeoutRef.current);
    };
  }, [setWhisper, stopHintLoop, clearFeedbackTimer]);

  // Magic phrase detector: "hello.echo"
  useEffect(() => {
    let buffer = '';

    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(document.activeElement)) return;

      if (e.key === 'Backspace') buffer = buffer.slice(0, -1);
      else if (e.key.length === 1) buffer += e.key;
      else if (e.key === 'Enter') handleSubmitPassword();

      if (buffer.length > 32) buffer = buffer.slice(-32);

      if (buffer.toLowerCase().includes('hello.echo')) {
        setWhisper('... SIGNAL ACCEPTED');
        grantAccess('magic_phrase');
        buffer = '';
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [grantAccess, handleSubmitPassword, setWhisper]);

  return (
    <main className="access-container">
      <h2 className="access-title">&gt; ECHO ACCESS</h2>

      <div className="password-display">
        &gt; ENTER ECHO PASSWORD:
        <div className="password-input" aria-label="Password attempt">
          {passwordAttempt}
        </div>
      </div>

      <div className="keyboard" aria-label="On-screen keyboard">
        {KEYBOARD_LAYOUT.map((row, index) => (
          <div key={index} className="keyboard-row">
            {row.map((key) => {
              const upper = key.toUpperCase();
              const isEnter = upper === 'ENTER';
              const isDel = upper === 'DEL';
              const isHighlighted = highlightedKey === upper;

              return (
                <button
                  key={key}
                  type="button"
                  className={[
                    'keyboard-key',
                    isEnter ? 'enter-key' : '',
                    isDel ? 'del-key' : '',
                    isHighlighted ? 'highlight' : '',
                  ].join(' ')}
                  onClick={() => handleKeyboardInput(key)}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {feedback && <p className="feedback">{feedback}</p>}

      <p className="instruction">(Listen for the echoing letters)</p>
      {/* Whisper overlay is mounted globally in App.jsx — do NOT mount it here */}
    </main>
  );
}
