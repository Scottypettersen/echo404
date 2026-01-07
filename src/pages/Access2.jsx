// src/pages/Access2.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';
import './Access2.css';

const TARGET = 'TAKE AWAY';
const MAX_WRONG = 6;

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function normalize(str) {
  return String(str || '').toUpperCase();
}

function makeRevealFromTarget(target) {
  return target.split('').map((ch) => (ch === ' ' ? ' ' : '_'));
}

function useMediaQuery(query) {
  const getMatch = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);

    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

export default function Access2() {
  const navigate = useNavigate();
  const { setWhisper, setFlag, emit, bumpEntropy } = useEcho();

  const isPhone = useMediaQuery('(max-width: 600px)');
  const answerInputRef = useRef(null);

  const [typedAnswer, setTypedAnswer] = useState('');
  const [reveal, setReveal] = useState(() => makeRevealFromTarget(TARGET));
  const [wrong, setWrong] = useState(0);
  const [tried, setTried] = useState([]);
  const [status, setStatus] = useState('ready'); // ready | fail | success | dead
  const [highlightedKey, setHighlightedKey] = useState('');

  const hintTimeoutRef = useRef(null);
  const highlightTimeoutRef = useRef(null);

  // refs to avoid stale state in timers/handlers
  const statusRef = useRef(status);
  const wrongRef = useRef(wrong);
  const revealRef = useRef(reveal);
  const triedRef = useRef(tried);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    wrongRef.current = wrong;
  }, [wrong]);
  useEffect(() => {
    revealRef.current = reveal;
  }, [reveal]);
  useEffect(() => {
    triedRef.current = tried;
  }, [tried]);

  const targetChars = useMemo(() => TARGET.split(''), []);
  const targetSet = useMemo(() => new Set(TARGET.replace(/ /g, '').split('')), []);

  const allKeys = useMemo(() => KEYBOARD_LAYOUT.flat(), []);
  const allKeysSet = useMemo(() => new Set(allKeys.map((k) => normalize(k))), [allKeys]);

  const stopHints = useCallback(() => {
    clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = null;
  }, []);

  const scheduleHint = useCallback(() => {
    stopHints();

    const hints = {
      stripAway: ['... try peeling it off...', '... a piece might slide away...', '... gently remove it...'],
      lossDeprivation: ['... a feeling of something gone...', "... what's being subtracted?...", '... the absence of something...'],
      insightConclusion: ['... what remains after taking? ...', '... the result of a removal...', '... consider the remainder...'],
      emotionalExistential: ['... letting go of a part...', '... the act of separating...', '... reducing the whole...'],
      length: [
        `... two parts: ${TARGET.split(' ')[0].length} and ${TARGET.split(' ')[1].length}...`,
        '... a shorter and then a longer...',
      ],
    };

    const delay = 10000 + Math.random() * 7000;

    hintTimeoutRef.current = setTimeout(() => {
      const curStatus = statusRef.current;
      const curWrong = wrongRef.current;
      const curReveal = revealRef.current.join('');

      if (curStatus !== 'ready') return;
      if (curWrong >= MAX_WRONG) return;
      if (curReveal === TARGET) return;

      const category = getRandomElement(Object.keys(hints));
      setWhisper(`... transmission received: ${getRandomElement(hints[category])}`);

      scheduleHint(); // reschedule itself
    }, delay);
  }, [setWhisper, stopHints]);

  // boot messaging + start hints
  useEffect(() => {
    setWhisper(isPhone ? 'ECHO PUZZLE 2: TAP TO GUESS' : 'ECHO PUZZLE 2: TYPE OR GUESS');

    const intro = setTimeout(() => {
      setWhisper(isPhone ? '... try tapping the letters...' : '... input the phrase or guess letters...');
    }, 6000);

    const start = setTimeout(() => scheduleHint(), 12000);

    if (!isPhone) {
      setTimeout(() => answerInputRef.current?.focus(), 50);
    }

    return () => {
      clearTimeout(intro);
      clearTimeout(start);
      stopHints();
      clearTimeout(highlightTimeoutRef.current);
    };
  }, [setWhisper, isPhone, scheduleHint, stopHints]);

  const failPulse = useCallback(() => {
    setStatus('fail');
    setTimeout(() => {
      if (statusRef.current !== 'dead' && statusRef.current !== 'success') {
        setStatus('ready');
      }
    }, 260);
  }, []);

  const grantAccess = useCallback(
    (solvedBy = 'letters') => {
      setStatus('success');
      setWhisper('ACCESS GRANTED');
      stopHints();

      if (typeof setFlag === 'function') setFlag('ACCESS2_DONE', true);

      emit?.('ACCESS2_SUCCESS', {
        wrong: wrongRef.current,
        triedCount: triedRef.current.length,
        solvedBy,
      });

      setTimeout(() => navigate('/access3'), 900);
    },
    [navigate, setWhisper, setFlag, stopHints, emit]
  );

  const lockOut = useCallback(() => {
    setStatus('dead');
    setWhisper('SYSTEM LOCKED');
    stopHints();

    emit?.('ACCESS2_LOCKED', { wrong: wrongRef.current });
    bumpEntropy?.(3, 'access2_locked');

    setTimeout(() => navigate('/denied'), 900);
  }, [setWhisper, stopHints, emit, bumpEntropy, navigate]);

  const applyGuessLetter = useCallback(
    (letter) => {
      const upper = normalize(letter);
      if (!upper || upper.length !== 1) return;
      if (statusRef.current !== 'ready') return;

      // ignore already tried (use ref to avoid stale state)
      if (triedRef.current.includes(upper)) return;

      setTried((prev) => [...prev, upper]);

      const correct = targetSet.has(upper);

      if (correct) {
        setReveal((prev) => prev.map((ch, i) => (targetChars[i] === upper ? upper : ch)));
        setWhisper(`REVEALED: ${upper}`);
        emit?.('ACCESS2_REVEAL', { letter: upper });
      } else {
        setWrong((prev) => prev + 1);
        setWhisper(`WRONG: ${upper}`);

        emit?.('ACCESS2_WRONG_LETTER', { letter: upper, wrong: wrongRef.current + 1 });
        bumpEntropy?.(1, 'access2_wrong_letter');

        failPulse();
      }
    },
    [setWhisper, failPulse, targetSet, targetChars, emit, bumpEntropy]
  );

  const handleKeyboardInput = useCallback(
    (key) => {
      if (statusRef.current !== 'ready') return;

      const upperKey = normalize(key);
      setHighlightedKey(upperKey);

      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = setTimeout(() => setHighlightedKey(''), 220);

      if (allKeysSet.has(upperKey)) {
        applyGuessLetter(upperKey);
      }
    },
    [applyGuessLetter, allKeysSet]
  );

  const handleInputChange = useCallback((e) => {
    setTypedAnswer(normalize(e.target.value));
  }, []);

  const handleSubmitAnswer = useCallback(() => {
    if (statusRef.current !== 'ready') return;
    if (isPhone) return;

    const guess = normalize(typedAnswer).trim();
    if (!guess) return;

    if (guess === TARGET) {
      setReveal(targetChars);
      grantAccess('phrase');
    } else {
      setWrong((prev) => prev + 1);
      setWhisper(`INCORRECT GUESS: ${guess}`);

      emit?.('ACCESS2_WRONG_PHRASE', { guess, wrong: wrongRef.current + 1 });
      bumpEntropy?.(2, 'access2_wrong_phrase');

      failPulse();
    }

    setTypedAnswer('');
    answerInputRef.current?.focus();
  }, [typedAnswer, isPhone, setWhisper, failPulse, grantAccess, targetChars, emit, bumpEntropy]);

  const handleKeyDown = useCallback(
    (event) => {
      if (isPhone) return;

      if (event.key === 'Enter') {
        handleSubmitAnswer();
        return;
      }

      const activeIsInput = document.activeElement === answerInputRef.current;
      if (activeIsInput) return;

      const key = normalize(event.key);
      if (allKeysSet.has(key) && !triedRef.current.includes(key)) {
        applyGuessLetter(key);
      }
    },
    [isPhone, handleSubmitAnswer, applyGuessLetter, allKeysSet]
  );

  // Watch for completion / lockout
  useEffect(() => {
    const solved = reveal.join('') === TARGET;
    if (solved && status !== 'success') {
      // if they solved by letters (most common), we’ll mark it as letters unless they already solved via phrase
      grantAccess('letters');
      return;
    }

    if (wrong >= MAX_WRONG && status !== 'dead' && status !== 'success') {
      lockOut();
    }
  }, [reveal, wrong, status, grantAccess, lockOut]);

  return (
    <main className="access2-container" onKeyDown={handleKeyDown}>
      <h1 className="access2-title">&gt; ECHO PUZZLE 2</h1>

      <p className="access2-subtitle">
        {isPhone ? 'Tap the on-screen keyboard to guess letters.' : 'Type letters or the full phrase using your keyboard.'}
      </p>

      <div className="access2-hangman" aria-label="Phrase reveal">
        {reveal.map((ch, i) => (
          <span key={i} className="access2-letter">
            {ch}
          </span>
        ))}
      </div>

      {isPhone ? (
        <div className="access2-keyboard" aria-label="On-screen keyboard">
          {KEYBOARD_LAYOUT.map((row, index) => (
            <div key={index} className="access2-keyboard-row">
              {row.map((key) => {
                const upper = normalize(key);
                const isTried = tried.includes(upper);
                const isHighlight = highlightedKey === upper;

                return (
                  <button
                    key={key}
                    type="button"
                    className={['access2-keyboard-key', isHighlight ? 'highlight' : '', isTried ? 'tried' : ''].join(' ')}
                    onClick={() => handleKeyboardInput(key)}
                    disabled={status !== 'ready' || isTried}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="access2-input-area">
          <input
            ref={answerInputRef}
            type="text"
            className="access2-answer-input"
            placeholder="Type full answer"
            value={typedAnswer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={status !== 'ready'}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="access2-submit-button"
            onClick={handleSubmitAnswer}
            disabled={status !== 'ready' || typedAnswer.trim() === ''}
          >
            Submit Answer
          </button>
        </div>
      )}

      <p className="access2-info">
        Wrong: {wrong} / {MAX_WRONG}
        {!isPhone && (
          <>
            <br />
            Tried: {tried.join(', ') || 'none'}
          </>
        )}
      </p>

      {status === 'success' && <p className="access2-success">✓ Phrase revealed.</p>}
      {status === 'fail' && <p className="access2-fail">✗ Incorrect guess.</p>}
      {status === 'dead' && <p className="access2-dead">Too many wrong — access denied.</p>}
    </main>
  );
}
