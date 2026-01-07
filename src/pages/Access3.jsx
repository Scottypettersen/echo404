// src/pages/Access3.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';
import './Access3.css';

const SEQUENCE_LENGTH = 6;
const DISPLAY_DURATION = 1200;
const RECALL_ATTEMPTS = 4;
const CHAR_SET = '0123';

const ACCESS3_WHISPERS = [
  '... the echo demands precision...',
  "... a fleeting pattern, held in the mind's eye...",
  '... digital ghosts whisper their order...',
  '... the sequence unravels with time...',
  '... remember the pulse of the data stream...',
  '... fragments of truth, in precise alignment...',
  '... the system tests your recall, human...',
  '... what was shown, must be returned...',
  '... the static holds a hidden rhythm...',
  '... a glitch in memory... or a test?',
  '... they learn what you retain...',
  '... the network gauges your processing...',
  '... every digit holds a breath...',
  '... the core remembers your attempts...',
];

function normalizeDigit(key) {
  const s = String(key ?? '');
  return s.length === 1 && CHAR_SET.includes(s) ? s : null;
}

function generateSequence(length) {
  const out = [];
  for (let i = 0; i < length; i++) {
    out.push(CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]);
  }
  return out;
}

export default function Access3() {
  const navigate = useNavigate();
  const { setWhisper, setFlag, emit, bumpEntropy } = useEcho();

  const [sequence, setSequence] = useState(() => generateSequence(SEQUENCE_LENGTH));
  const [userSequence, setUserSequence] = useState('');
  const [displaying, setDisplaying] = useState(true);
  const [attempt, setAttempt] = useState(1);
  const [feedback, setFeedback] = useState('');

  const inputRef = useRef(null);
  const displayTimerRef = useRef(null);
  const whisperTimerRef = useRef(null);
  const revealRestartTimerRef = useRef(null);

  // refs to avoid stale closures inside timers/handlers
  const displayingRef = useRef(displaying);
  const attemptRef = useRef(attempt);
  const userSeqRef = useRef(userSequence);
  const seqRef = useRef(sequence);

  useEffect(() => {
    displayingRef.current = displaying;
  }, [displaying]);
  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);
  useEffect(() => {
    userSeqRef.current = userSequence;
  }, [userSequence]);
  useEffect(() => {
    seqRef.current = sequence;
  }, [sequence]);

  const blanks = useMemo(() => Array(SEQUENCE_LENGTH).fill('_').join(''), []);
  const sequenceStr = useMemo(() => sequence.join(''), [sequence]);

  const stopTimers = useCallback(() => {
    clearTimeout(displayTimerRef.current);
    clearTimeout(whisperTimerRef.current);
    clearTimeout(revealRestartTimerRef.current);
    displayTimerRef.current = null;
    whisperTimerRef.current = null;
    revealRestartTimerRef.current = null;
  }, []);

  const focusInput = useCallback(() => {
    // Note: div focus works because it has tabIndex={0}
    inputRef.current?.focus();
  }, []);

  const scheduleWhisper = useCallback(() => {
    clearTimeout(whisperTimerRef.current);

    const delay = 7000 + Math.random() * 5000; // 7–12s
    whisperTimerRef.current = setTimeout(() => {
      // Only whisper if still on this screen / puzzle active
      const idx = Math.floor(Math.random() * ACCESS3_WHISPERS.length);
      setWhisper(`... ECHO: ${ACCESS3_WHISPERS[idx]}`);
      scheduleWhisper();
    }, delay);
  }, [setWhisper]);

  const startSequenceDisplay = useCallback(() => {
    // show sequence
    setDisplaying(true);
    setUserSequence('');
    setFeedback('Memorize the sequence...');

    clearTimeout(displayTimerRef.current);
    displayTimerRef.current = setTimeout(() => {
      setDisplaying(false);
      setFeedback('Enter the sequence...');
      focusInput();
    }, DISPLAY_DURATION);
  }, [focusInput]);

  const grantAccess = useCallback(() => {
    stopTimers();
    setFeedback('SEQUENCE MATCHED. ACCESS GRANTED.');
    setWhisper('ACCESS GRANTED');

    setFlag?.('ACCESS3_DONE', true);
    emit?.('ACCESS3_SUCCESS', {
      attempt: attemptRef.current,
      target: seqRef.current.join(''),
    });

    setTimeout(() => navigate('/puzzle'), 900);
  }, [navigate, setWhisper, setFlag, emit, stopTimers]);

  const denyAccess = useCallback(
    (reason = 'lockout') => {
      stopTimers();
      setFeedback('ACCESS DENIED. SYSTEM LOCKDOWN.');
      setWhisper('SYSTEM LOCKED');

      emit?.('ACCESS3_LOCKED', {
        reason,
        attempt: attemptRef.current,
        target: seqRef.current.join(''),
      });

      setTimeout(() => navigate('/denied'), 1100);
    },
    [navigate, setWhisper, emit, stopTimers]
  );

  const checkSequence = useCallback(() => {
    if (displayingRef.current) return;

    const guess = userSeqRef.current;
    const target = seqRef.current.join('');

    if (guess.length !== SEQUENCE_LENGTH) return;

    if (guess === target) {
      grantAccess();
      return;
    }

    // wrong guess
    const curAttempt = attemptRef.current;

    emit?.('ACCESS3_FAIL', { guess, target, attempt: curAttempt });
    bumpEntropy?.(1, 'access3_wrong_sequence');

    if (curAttempt < RECALL_ATTEMPTS) {
      setFeedback(`SEQUENCE INCORRECT. Attempt ${curAttempt} of ${RECALL_ATTEMPTS}.`);
      setAttempt((a) => a + 1);

      // Refresh sequence each attempt (anti-bruteforce)
      setSequence(generateSequence(SEQUENCE_LENGTH));

      // Restart reveal after a beat
      clearTimeout(revealRestartTimerRef.current);
      revealRestartTimerRef.current = setTimeout(() => startSequenceDisplay(), 900);
    } else {
      bumpEntropy?.(3, 'access3_lockout');
      denyAccess('max_attempts');
    }
  }, [grantAccess, denyAccess, startSequenceDisplay, emit, bumpEntropy]);

  const pushDigit = useCallback(
    (digit) => {
      if (displayingRef.current) return;

      const d = normalizeDigit(digit);
      if (!d) return;

      setUserSequence((prev) => {
        if (prev.length >= SEQUENCE_LENGTH) return prev;
        return prev + d;
      });

      emit?.('ACCESS3_INPUT', { digit: d, len: userSeqRef.current.length + 1 });
      focusInput();
    },
    [focusInput, emit]
  );

  const popDigit = useCallback(() => {
    if (displayingRef.current) return;

    setUserSequence((prev) => prev.slice(0, -1));
    emit?.('ACCESS3_BACKSPACE', { len: Math.max(0, userSeqRef.current.length - 1) });
    focusInput();
  }, [focusInput, emit]);

  // Boot: start display + whispers once (StrictMode-safe)
  useEffect(() => {
    setWhisper('ACCESS POINT THREE: RECALL SEQUENCE');

    stopTimers(); // important for StrictMode double-mount
    startSequenceDisplay();

    const t = setTimeout(() => scheduleWhisper(), 2500);
    setTimeout(() => focusInput(), 50);

    emit?.('ACCESS3_START', { length: SEQUENCE_LENGTH, charset: CHAR_SET });

    return () => {
      clearTimeout(t);
      stopTimers();
    };
  }, [setWhisper, startSequenceDisplay, scheduleWhisper, focusInput, stopTimers, emit]);

  // Global keyboard support
  useEffect(() => {
    const onKeyDown = (event) => {
      if (displayingRef.current) return;

      if (event.key === 'Backspace') {
        event.preventDefault();
        popDigit();
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        checkSequence();
        return;
      }

      const d = normalizeDigit(event.key);
      if (d) {
        event.preventDefault();
        pushDigit(d);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [checkSequence, popDigit, pushDigit]);

  return (
    <main className="access3-container">
      <h1 className="access3-title">&gt; FINAL TRACE LOCK</h1>
      <p className="access3-subtitle">Recall the digital echo.</p>

      <div className={`sequence-display ${displaying ? 'displaying' : ''}`} aria-label="Sequence display">
        {displaying ? sequenceStr : blanks}
      </div>

      <div className="input-area">
        <div
          ref={inputRef}
          className="user-input"
          tabIndex={0}
          aria-label="Enter the sequence"
          onClick={focusInput}
        >
          {userSequence || blanks}
        </div>

        <div className="keypad" aria-label="Keypad">
          {CHAR_SET.split('').map((char) => (
            <button
              key={char}
              type="button"
              className="keypad-button"
              onClick={() => pushDigit(char)}
              disabled={displaying || userSequence.length >= SEQUENCE_LENGTH}
            >
              {char}
            </button>
          ))}

          <button
            type="button"
            className="keypad-button backspace"
            onClick={popDigit}
            disabled={displaying || userSequence.length === 0}
            aria-label="Backspace"
          >
            &lt;--
          </button>

          <button
            type="button"
            className="keypad-button check"
            onClick={checkSequence}
            disabled={displaying || userSequence.length !== SEQUENCE_LENGTH}
          >
            CHECK
          </button>
        </div>
      </div>

      {feedback && <p className="feedback">{feedback}</p>}
    </main>
  );
}
