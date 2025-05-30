// src/components/Whisper.jsx
import { useEcho } from '../context/EchoContext';
import { useEffect, useState } from 'react';

export default function Whisper() {
  const { whisper } = useEcho();
  const [visible, setVisible] = useState(false);
  const [currentWhisper, setCurrentWhisper] = useState('');

  useEffect(() => {
    if (whisper && whisper !== currentWhisper) {
      setCurrentWhisper(whisper);
      setVisible(true);
    } else if (!whisper) {
      setVisible(false);
      setCurrentWhisper('');
    }
  }, [whisper, currentWhisper]);

  if (!currentWhisper || !visible) return null;

  return (
    <div style={styles.overlay}>
      <span style={styles.text}>{currentWhisper}</span>
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
    animation: 'fadeIn 0.5s ease',
  },
  text: {
    fontFamily: 'monospace',
    color: '#0f0',
    fontSize: '1rem',
    whiteSpace: 'pre-wrap',
    textShadow: '0 0 5px #0f0',
  },
};

// Define the fadeIn animation (if not already globally defined)
if (typeof document !== 'undefined' && document.styleSheets && document.styleSheets.length > 0 && !Array.from(document.styleSheets[0].cssRules || []).some(rule => rule.name === 'fadeIn')) {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `, styleSheet.cssRules?.length || 0);
}