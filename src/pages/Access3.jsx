// src/pages/Access3.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';
import './Access3.css'; // Make sure to create Access3.css

const SEQUENCE_LENGTH = 6;
const DISPLAY_DURATION = 1200;
const RECALL_ATTEMPTS = 4;
const CHAR_SET = '0123';

// New array of cryptic and relevant whispers for Access3
const ACCESS3_WHISPERS = [
  "... the echo demands precision...",
  "... a fleeting pattern, held in the mind's eye...",
  "... digital ghosts whisper their order...",
  "... the sequence unravels with time...",
  "... remember the pulse of the data stream...",
  "... fragments of truth, in precise alignment...",
  "... the system tests your recall, human...",
  "... what was shown, must be returned...",
  "... the static holds a hidden rhythm...",
  "... a glitch in memory... or a test?",
  "... they learn what you retain...", // AI concern
  "... the network gauges your processing...", // AI concern
  "... every digit holds a breath...",
  "... the core remembers your attempts...",
];

function generateSequence(length) {
  let sequence = [];
  for (let i = 0; i < length; i++) {
    sequence.push(CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]);
  }
  return sequence;
}

export default function Access3() {
  const [sequence, setSequence] = useState(() => generateSequence(SEQUENCE_LENGTH));
  const [userSequence, setUserSequence] = useState('');
  const [displaying, setDisplaying] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();
  const { setWhisper } = useEcho();
  const timerRef = useRef(null);
  const inputRef = useRef(null); // Ref for the visual input slot
  const whisperIntervalRef = useRef(null); // Ref for the whisper interval

  useEffect(() => {
    setWhisper('ACCESS POINT THREE: RECALL SEQUENCE');
    startSequenceDisplay();

    // Set up continuous cryptic whispers
    const initialWhisperTimeout = setTimeout(() => {
      whisperIntervalRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * ACCESS3_WHISPERS.length);
        setWhisper(`... ECHO: ${ACCESS3_WHISPERS[randomIndex]}`);
      }, 7000 + Math.random() * 5000); // Random interval between 7 and 12 seconds
    }, 3000); // Initial delay before whispers start

    // Focus the input slot on mount (for desktop users)
    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(initialWhisperTimeout); // Clear initial whisper timeout
      clearInterval(whisperIntervalRef.current); // Clear recurring whisper interval
    };
  }, [setWhisper]);

  const startSequenceDisplay = useCallback(() => {
    setDisplaying(true);
    setFeedback('Memorize the sequence...');
    setUserSequence(''); // Reset user input for new attempt
    timerRef.current = setTimeout(() => {
      setDisplaying(false);
      setFeedback('Enter the sequence...');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, DISPLAY_DURATION);
  }, [setUserSequence]);

  const handleVirtualKeyPress = useCallback((char) => {
    if (!displaying && userSequence.length < SEQUENCE_LENGTH) {
      setUserSequence(prevSequence => prevSequence + char);
      if (inputRef.current) {
        inputRef.current.focus(); // Keep focus on the input slot
      }
    }
  }, [displaying, userSequence]);

  const handleBackspace = useCallback(() => {
    if (!displaying && userSequence.length > 0) {
      setUserSequence(prevSequence => prevSequence.slice(0, -1));
      if (inputRef.current) {
        inputRef.current.focus(); // Keep focus on the input slot
      }
    }
  }, [displaying, userSequence]);

  const checkSequence = useCallback(() => {
    if (!displaying) {
      if (userSequence === sequence.join('')) {
        setFeedback('SEQUENCE MATCHED. ACCESS GRANTED.');
        setTimeout(() => navigate('/wall'), 1500);
      } else {
        setFeedback(`SEQUENCE INCORRECT. Attempt ${attempt} of ${RECALL_ATTEMPTS}.`);
        if (attempt < RECALL_ATTEMPTS) {
          setAttempt(attempt + 1);
          setTimeout(startSequenceDisplay, 2000);
        } else {
          setFeedback('ACCESS DENIED. SYSTEM LOCKDOWN.');
          setTimeout(() => navigate('/denied'), 2000);
        }
      }
      if (inputRef.current) {
        inputRef.current.focus(); // Refocus after checking
      }
    }
  }, [userSequence, sequence, attempt, navigate, displaying, startSequenceDisplay]);

  const handleKeyDown = useCallback((event) => {
    if (!displaying) {
      if (CHAR_SET.includes(event.key.toUpperCase()) && userSequence.length < SEQUENCE_LENGTH) {
        setUserSequence(prevSequence => prevSequence + event.key.toUpperCase());
      } else if (event.key === 'Backspace') {
        setUserSequence(prevSequence => prevSequence.slice(0, -1));
      } else if (event.key === 'Enter' && userSequence.length === SEQUENCE_LENGTH) {
        checkSequence();
      }
    }
  }, [displaying, userSequence, checkSequence]);

  return (
    <main className="access3-container">
      <h1 className="access3-title">&gt; FINAL TRACE LOCK</h1>
      <p className="access3-subtitle">Recall the digital echo.</p>

      <div className={`sequence-display ${displaying ? 'displaying' : ''}`}>
        {displaying ? sequence.join('') : Array(SEQUENCE_LENGTH).fill('_').join('')}
      </div>

      <div className="input-area">
        <div
          ref={inputRef}
          className="user-input"
          tabIndex={0}
          aria-label="Enter the sequence"
          onKeyDown={handleKeyDown} // Attach the listener here
          onClick={() => inputRef.current?.focus()} // Ensure focus on click
        >
          {userSequence || Array(SEQUENCE_LENGTH).fill('_').join('')}
        </div>
        <div className="keypad">
          {CHAR_SET.split('').map(char => (
            <button
              key={char}
              className="keypad-button"
              onClick={() => handleVirtualKeyPress(char)}
              disabled={displaying || userSequence.length >= SEQUENCE_LENGTH}
              tabIndex={0}
            >
              {char}
            </button>
          ))}
          {userSequence.length > 0 && (
            <button className="keypad-button backspace" onClick={handleBackspace} disabled={displaying} tabIndex={0}>
              &lt;--
            </button>
          )}
          <button className="keypad-button check" onClick={checkSequence} disabled={displaying || userSequence.length !== SEQUENCE_LENGTH} tabIndex={0}>
            CHECK
          </button>
        </div>
      </div>

      {feedback && <p className="feedback">{feedback}</p>}
    </main>
  );
}