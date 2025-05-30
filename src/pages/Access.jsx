// src/pages/Access2.jsx
import React, { useState, useEffect } from 'react';
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
const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const SYNONYMS = ['remove', 'extract', 'seize', 'abduct', 'eliminate', 'withdraw', 'detach', 'usurp'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default function Access2() {
  const { setWhisper } = useEcho();
  const navigate = useNavigate();

  const [reveal, setReveal] = useState(
    TARGET.split('').map(ch => (ch === ' ' ? ' ' : '_'))
  );
  const [wrong, setWrong] = useState(0);
  const [tried, setTried] = useState([]);
  const [status, setStatus] = useState('ready');
  const [highlightedKey, setHighlightedKey] = useState('');
  const [hintTimer, setHintTimer] = useState(null);

  useEffect(() => {
    setWhisper('ECHO PUZZLE 2: UNLOCK LETTERS');

    const initialHintTimeout = setTimeout(() => {
      setWhisper('... a breathy sound might appear...'); // Initial vowel hint
    }, 5000);
    setHintTimer(initialHintTimeout);

    return () => clearTimeout(initialHintTimeout);
  }, [setWhisper]);

  const triggerHint = () => {
    clearTimeout(hintTimer);
    if (status === 'ready' && wrong < MAX_WRONG && reveal.join('') !== TARGET) {
      if (Math.random() < 0.5) {
        const unguessedVowels = VOWELS.filter(v => !tried.includes(v) && TARGET.includes(v));
        if (unguessedVowels.length > 0) {
          setWhisper(`... perhaps a ${getRandomElement(['soft', 'open', 'airy'])} sound resonates...`); // Vowel
        } else {
          const unguessedConsonants = KEYBOARD_LAYOUT.flat().filter(
            c => !VOWELS.includes(c) && !tried.includes(c) && TARGET.includes(c)
          );
          if (unguessedConsonants.length > 0) {
            setWhisper(`... a more ${getRandomElement(['firm', 'stopped', 'sharp'])} echo returns...`); // Consonant
          } else {
            setWhisper('... the silence holds a faint trace...'); // Last resort
          }
        }
      } else {
        const chosenSynonym = getRandomElement(SYNONYMS);
        setWhisper(`... the echo suggests to ${chosenSynonym} something...`); // Synonym hint
      }
      const newHintTimer = setTimeout(triggerHint, 8000 + Math.random() * 5000);
      setHintTimer(newHintTimer);
    }
  };

  useEffect(() => {
    const recurringHintTimer = setTimeout(triggerHint, 10000);
    setHintTimer(recurringHintTimer);
    return () => clearTimeout(recurringHintTimer);
  }, [status, wrong, reveal]);

  const handleGuess = (letter) => {
    const upperLetter = letter.toUpperCase();
    if (status !== 'ready' || tried.includes(upperLetter)) {
      return;
    }

    setTried(t => [...t, upperLetter]);

    if (TARGET.includes(upperLetter)) {
      setReveal(r =>
        r.map((ch, i) => (TARGET[i] === upperLetter ? upperLetter : ch))
      );
      setWhisper(`REVEALED: ${upperLetter}`);
    } else {
      setWrong(w => w + 1);
      setWhisper(`WRONG: ${upperLetter}`);
      setStatus('fail');
      setTimeout(() => setStatus('ready'), 300);
    }
  };

  const handleKeyboardInput = (key) => {
    if (status === 'ready') {
      if (KEYBOARD_LAYOUT.flat().includes(key.toUpperCase())) {
        handleGuess(key);
        setHighlightedKey(key.toUpperCase());
        setTimeout(() => setHighlightedKey(''), 300);
      }
    }
  };

  useEffect(() => {
    if (reveal.join('') === TARGET) {
      setStatus('success');
      setWhisper('ACCESS GRANTED');
      clearTimeout(hintTimer);
      setTimeout(() => navigate('/access-3'), 1000);
    } else if (wrong >= MAX_WRONG) {
      setStatus('dead');
      setWhisper('SYSTEM LOCKED');
      clearTimeout(hintTimer);
    }
  }, [reveal, wrong, setWhisper, navigate, hintTimer]);

  return (
    <main className="access2-container">
      <h1 className="access2-title">&gt; ECHO PUZZLE 2</h1>
      <p className="access2-subtitle">
        Guess the letters to reveal the secret phrase.
      </p>

      <div className="access2-hangman">
        {reveal.map((ch, i) => (
          <span key={i} className="access2-letter">{ch}</span>
        ))}
      </div>

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

      <p className="access2-info">
        Tried: {tried.join(', ') || 'none'}<br/>
        Wrong: {wrong} / {MAX_WRONG}
      </p>

      {status === 'success' && (
        <p className="access2-success">✓ Phrase revealed!</p>
      )}
      {status === 'fail' && (
        <p className="access2-fail">✗ No “{tried.slice(-1)[0]}” in there.</p>
      )}
      {status === 'dead' && (
        <p className="access2-dead">Too many wrong—access denied.</p>
      )}
    </main>
  );
}