// src/pages/Access2.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
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

function Access2() {
  const { setWhisper } = useEcho();
  const navigate = useNavigate();
  const isPhone = useMediaQuery('(max-width: 600px)');
  const answerInputRef = useRef(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [reveal, setReveal] = useState(
    TARGET.split('').map(ch => (ch === ' ' ? ' ' : '_'))
  );
  const [wrong, setWrong] = useState(0);
  const [tried, setTried] = useState([]);
  const [status, setStatus] = useState('ready');
  const [highlightedKey, setHighlightedKey] = useState('');
  const hintTimerRef = useRef(null);

  const triggerHint = useCallback(() => {
    clearTimeout(hintTimerRef.current);
    if (status === 'ready' && wrong < MAX_WRONG && reveal.join('') !== TARGET) {
      const hintDelay = 10000 + Math.random() * 7000;
      const hints = {
        stripAway: [`... try peeling it off...`, `... a piece might slide away...`, `... gently remove it...`],
        lossDeprivation: [`... a feeling of something gone...`, `... what's being subtracted?...`, `... the absence of something...`],
        insightConclusion: [`... what remains after taking? ...`, `... the result of a removal...`, `... consider the remainder...`],
        emotionalExistential: [`... letting go of a part...`, `... the act of separating...`, `... reducing the whole...`],
        length: [`... two parts: ${TARGET.split(' ')[0].length} and ${TARGET.split(' ')[1].length}...`, `... a shorter and then a longer...`],
      };
      const category = getRandomElement(Object.keys(hints));
      setWhisper(`... transmission received: ${getRandomElement(hints[category])}`);
      hintTimerRef.current = setTimeout(triggerHint, hintDelay);
    }
  }, [status, wrong, reveal, setWhisper, TARGET]);

  useEffect(() => {
    const recurringHintTimer = setTimeout(triggerHint, 12000);
    hintTimerRef.current = recurringHintTimer;
    return () => clearTimeout(recurringHintTimer);
  }, [triggerHint]);

  useEffect(() => {
    setWhisper(isPhone ? 'ECHO PUZZLE 2: TAP TO GUESS' : 'ECHO PUZZLE 2: TYPE OR GUESS');
    const initialHintTimeout = setTimeout(() => {
      setWhisper(isPhone ? '... try tapping the letters...' : '... input the phrase or guess letters...');
    }, 6000);
    hintTimerRef.current = initialHintTimeout;
    if (!isPhone && answerInputRef.current) {
      answerInputRef.current.focus();
    }
    return () => clearTimeout(initialHintTimeout);
  }, [setWhisper, isPhone]);

  const handleGuess = useCallback((letter) => {
    const upperLetter = letter.toUpperCase();
    if (status !== 'ready' || tried.includes(upperLetter)) return;
    setTried(t => [...t, upperLetter]);
    const isCorrect = TARGET.includes(upperLetter);
    setReveal(r => r.map((char, i) => (TARGET[i] === upperLetter ? upperLetter : char)));
    setWhisper(isCorrect ? `REVEALED: ${upperLetter}` : `WRONG: ${upperLetter}`);
    if (!isCorrect) {
      setWrong(w => w + 1);
      setStatus('fail');
      setTimeout(() => setStatus('ready'), 300);
    }
  }, [status, tried, TARGET, setWhisper, setReveal, setWrong, setStatus]);

  const handleKeyboardInput = useCallback((key) => {
    if (status === 'ready') {
      const upperKey = key.toUpperCase();
      setHighlightedKey(upperKey);
      setTimeout(() => setHighlightedKey(''), 300);
      if (KEYBOARD_LAYOUT.flat().includes(upperKey)) {
        handleGuess(key);
      }
    }
  }, [status, handleGuess]);

  const handleInputChange = (event) => {
    setTypedAnswer(event.target.value.toUpperCase());
  };

  const handleSubmitAnswer = useCallback(() => {
    if (status === 'ready' && !isPhone && typedAnswer.trim() !== '') {
      const guess = typedAnswer.trim();
      if (guess === TARGET) {
        setReveal(TARGET.split(''));
        setStatus('success');
        setWhisper('ACCESS GRANTED');
        clearTimeout(hintTimerRef.current);
        setTimeout(() => navigate('/access-3'), 1000);
      } else {
        setWrong(w => w + 1);
        setWhisper(`INCORRECT GUESS: ${guess}`);
        setStatus('fail');
        setTimeout(() => setStatus('ready'), 300);
      }
      setTypedAnswer('');
      if (answerInputRef.current) answerInputRef.current.focus();
    }
  }, [status, typedAnswer, TARGET, setWhisper, setReveal, setWrong, setStatus, navigate, isPhone]);

  const handleKeyDown = useCallback((event) => {
    if (status === 'ready' && !isPhone && event.key === 'Enter' && typedAnswer.trim() !== '') {
      handleSubmitAnswer();
    } else if (status === 'ready' && !isPhone && KEYBOARD_LAYOUT.flat().includes(event.key.toUpperCase()) && !tried.includes(event.key.toUpperCase()) && document.activeElement !== answerInputRef.current) {
      handleGuess(event.key);
    }
  }, [status, typedAnswer, handleSubmitAnswer, isPhone, handleGuess, tried]);

  useEffect(() => {
    if (reveal.join('') === TARGET) {
      setStatus('success');
      setWhisper('ACCESS GRANTED');
      clearTimeout(hintTimerRef.current);
      setTimeout(() => navigate('/access-3'), 1000);
    } else if (wrong >= MAX_WRONG) {
      setStatus('dead');
      setWhisper('SYSTEM LOCKED');
      clearTimeout(hintTimerRef.current);
    }
  }, [reveal, wrong, setWhisper, navigate, TARGET]);

  return (
    <main className="access2-container">
      <h1 className="access2-title">&gt; ECHO PUZZLE 2</h1>
      <p className="access2-subtitle">
        {isPhone
          ? 'Tap the on-screen keyboard to guess letters.'
          : 'Type letters or the full phrase using your keyboard.'}
      </p>

      <div className="access2-hangman">
        {reveal.map((ch, i) => (
          <span key={i} className="access2-letter">{ch}</span>
        ))}
      </div>

      {isPhone && (
        <div className="access2-keyboard">
          {KEYBOARD_LAYOUT.map((row, index) => (
            <div key={index} className="access2-keyboard-row">
              {row.map((key) => (
                <button
                  key={key}
                  className={`access2-keyboard-key ${highlightedKey === key ? 'highlight' : ''} ${tried.includes(key) ? 'tried' : ''}`}
                  onClick={() => handleKeyboardInput(key)}
                  disabled={status !== 'ready' || tried.includes(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {!isPhone && (
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
          />
          <button
            className="access2-submit-button"
            onClick={handleSubmitAnswer}
            disabled={status !== 'ready' || typedAnswer.trim() === ''}
          >
            Submit Answer
          </button>
        </div>
      )}

      <p className="access2-info">
        {isPhone
          ? `Wrong: ${wrong} / ${MAX_WRONG}`
          : `Tried: ${tried.join(', ') || 'none'}<br/>Wrong: ${wrong} / ${MAX_WRONG}`}
      </p>

      {status === 'success' && <p className="access2-success">✓ Phrase revealed!</p>}
      {status === 'fail' && <p className="access2-fail">✗ Incorrect guess.</p>}
      {status === 'dead' && <p className="access2-dead">Too many wrong—access denied.</p>}
    </main>
  );
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

export default Access2;