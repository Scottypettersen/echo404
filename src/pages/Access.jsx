// src/pages/Access.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';
import Whisper from '../components/Whisper'; // Assuming Whisper.jsx is in 'components'
import './Access.css';

const SECRET_PASSWORD = "KAZANIS";
const WHISPER_DELAY = 2000; // Initial delay before hints (ms)
const HINT_INTERVAL = 2500; // Interval between hints (ms)
const CRYPTIC_WHISPERS = [
  "... the gatekeeper hums a tune...",
  "... shadows dance with secrets...",
  "... listen to the pulse of the machine...",
  "... echoes of forgotten protocols...",
  "... the first layer yields slowly...",
  "... a name etched in the static...",
  "... the key resonates...",
  "... silence holds the answer...",
];
const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL'],
  ['ENTER'],
];
const PASSWORD_LETTERS = SECRET_PASSWORD.toUpperCase().split('');

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Access() {
  const { setWhisper } = useEcho();
  const navigate = useNavigate();
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [hintQueue, setHintQueue] = useState(() => shuffleArray(PASSWORD_LETTERS));
  const [highlightedKey, setHighlightedKey] = useState('');
  const whisperIntervalRef = useRef(null);

  useEffect(() => {
    setWhisper('INITIATE ECHO SEQUENCE...');

    const initialHintTimeoutId = setTimeout(() => {
      whisperIntervalRef.current = setInterval(() => {
        // Randomly choose between a letter hint and a cryptic whisper
        if (Math.random() < 0.6) {
          if (hintQueue.length > 0) {
            const hint = hintQueue.shift();
            setWhisper(`... ECHO: ${hint}`);
          } else {
            // If the hint queue is empty, reshuffle and add the first letter
            setHintQueue(shuffleArray(PASSWORD_LETTERS));
            setWhisper(`... ECHO: ${shuffleArray(PASSWORD_LETTERS)[0]}`); // Immediately show a letter
          }
        } else {
          const randomIndex = Math.floor(Math.random() * CRYPTIC_WHISPERS.length);
          setWhisper(CRYPTIC_WHISPERS[randomIndex]);
        }
      }, HINT_INTERVAL);
    }, WHISPER_DELAY);

    return () => {
      clearTimeout(initialHintTimeoutId);
      clearInterval(whisperIntervalRef.current);
    };
  }, [setWhisper]); // Removed hintQueue from dependency array - the interval handles the looping

  const handleSubmitPassword = useCallback(() => {
    if (passwordAttempt.toUpperCase() === SECRET_PASSWORD.toUpperCase()) {
      setFeedback('ACCESS GRANTED');
      setTimeout(() => navigate('/access2'), 1000);
    } else {
      setFeedback('ACCESS DENIED');
      setTimeout(() => setFeedback(''), 1000);
    }
  }, [navigate, passwordAttempt]);

  const handleKeyboardInput = useCallback((key) => {
    const upperKey = key.toUpperCase();
    if (key === 'ENTER') {
      handleSubmitPassword();
    } else if (key === 'DEL') {
      setPasswordAttempt((prevAttempt) => prevAttempt.slice(0, -1));
    } else if (passwordAttempt.length < SECRET_PASSWORD.length) {
      setPasswordAttempt((prevAttempt) => prevAttempt + upperKey);
      setHighlightedKey(upperKey);
      setTimeout(() => setHighlightedKey(''), 300); // Brief highlight
    }
  }, [handleSubmitPassword]);

  return (
    <main className="access-container">
      <h2 className="access-title">&gt; ECHO ACCESS</h2>
      <div className="password-display">
        &gt; ENTER ECHO PASSWORD:
        <div className="password-input">{passwordAttempt}</div>
      </div>
      <div className="keyboard">
        {KEYBOARD_LAYOUT.map((row, index) => (
          <div key={index} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className={`keyboard-key ${key === 'ENTER' ? 'enter-key' : ''} ${key === 'DEL' ? 'del-key' : ''} ${highlightedKey === key.toUpperCase() ? 'highlight' : ''}`}
                onClick={() => handleKeyboardInput(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      {feedback && <p className="feedback">{feedback}</p>}
      <p className="instruction">(Listen for the echoing letters)</p>
      <Whisper />
    </main>
  );
}