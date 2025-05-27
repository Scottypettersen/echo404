// src/pages/Access1.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

const QUOTES = [
  { text: "Good design is honest.", author: "Dieter Rams" },
  { text: "Design is the silent ambassador of your brand.", author: "Paul Rand" },
  { text: "Design is thinking made visual.", author: "Saul Bass" },
  { text: "A designer knows he has achieved perfection not when there is nothing left to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
  { text: "Less, but better.", author: "Dieter Rams" },
  { text: "Styles come and go. Good design is a language, not a style.", author: "Massimo Vignelli" },
  { text: "Design is intelligence made visible.", author: "Alina Wheeler" }
];

// ROT13 utility
function rot13(str) {
  return str.replace(/[A-Za-z]/g, c =>
    String.fromCharCode(
      (c <= 'Z' ? 90 : 122),
      (c.charCodeAt(0) + 13) % (c <= 'Z' ? 65 : 97)
    )
  );
}

export default function Access1() {
  const { setWhisper } = useEcho();
  const navigate = useNavigate();
  const PHRASE = "TAKE AWAY";
  const SLOTS = PHRASE.replace(' ', '').length + 1; // count letters + space slot
  
  const [quote, setQuote] = useState(null);
  const [display, setDisplay] = useState([]);    // array of revealed letters ('' or char)
  const [cursor, setCursor] = useState(0);       // how many letters correct so far
  const containerRef = useRef();

  // pick a random quote and mask it
  useEffect(() => {
    const pick = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    // remove the phrase "take away" (case-insensitive) and ROT13 the rest
    const rx = new RegExp(PHRASE, 'i');
    const masked = pick.text.replace(rx, '==PHRASE==');
    const encoded = rot13(masked);
    setQuote({ author: pick.author, encoded });
    setDisplay(Array(PHRASE.length).fill(''));
    setWhisper('DECODE THE SIGNAL');
  }, [setWhisper]);

  // handle keypresses
  useEffect(() => {
    const handler = (e) => {
      if (cursor >= PHRASE.length) return;
      const expected = PHRASE[cursor];
      const pressed = e.key.toUpperCase();
      // allow space
      if (expected === ' ' && pressed === ' ') {
        advance();
      } else if (pressed === expected) {
        advance();
      } else if (e.key.length === 1) {
        // wrong printable key
        containerRef.current?.classList.add('shake');
        setWhisper('TRY AGAIN');
        setTimeout(() => containerRef.current?.classList.remove('shake'), 300);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cursor, setWhisper]);

  const advance = () => {
    const next = [...display];
    next[cursor] = PHRASE[cursor];
    setDisplay(next);
    setCursor(cursor + 1);

    if (cursor + 1 === PHRASE.length) {
      setWhisper('PHRASE COMPLETE');
      setTimeout(() => navigate('/access-2'), 1000);
    }
  };

  if (!quote) return null;

  return (
    <main
      ref={containerRef}
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
        textAlign: 'center'
      }}
    >
      <p style={{ marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
        {quote.encoded.replace('==PHRASE==', '█'.repeat(PHRASE.length))}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {display.map((ch, i) => (
          <div
            key={i}
            style={{
              width: '1.2ch',
              borderBottom: '1px solid #0f0',
              fontSize: '1.5rem'
            }}
          >
            {ch || (PHRASE[i] === ' ' ? '\u00A0' : '')}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.8rem', color: '#666' }}>
        (Type the missing phrase — one correct key at a time)
      </p>
    </main>
  );
}
