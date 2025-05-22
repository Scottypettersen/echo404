import { useEcho } from '../components/EchoContext';

import { useEffect, useState } from 'react';

export default function Whisper() {
  const { whisper } = useEcho();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (whisper) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [whisper]);

  if (!whisper || !visible) return null;

  return (
    <div style={styles.overlay}>
      <span style={styles.text}>{whisper}</span>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.85)',
    padding: '0.75rem 1.5rem',
    border: '1px solid #0f0',
    borderRadius: '8px',
    zIndex: 1000,
    pointerEvents: 'none',
    animation: 'fadeInOut 5s ease',
  },
  text: {
    fontFamily: 'monospace',
    color: '#0f0',
    fontSize: '1rem',
    whiteSpace: 'pre-wrap',
    textShadow: '0 0 5px #0f0',
  }
};useEffect(() => {
  console.log('[Whisper.jsx] whisper:', whisper); // Debug line
  if (whisper) {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }
}, [whisper]);

