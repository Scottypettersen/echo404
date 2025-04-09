import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const bootLines = [
  '> Initializing ECHO...',
  '> SYSTEM CORRUPTION DETECTED',
  '> Loading trace protocol...',
  '> User presence detected.',
  '> Are you here to help? (Y/N)'
];

function Trace() {
  const [lines, setLines] = useState([]);
  const [bootDone, setBootDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLines((prev) => [...prev, bootLines[index]]);
      index++;
      if (index === bootLines.length) {
        clearInterval(interval);
        setBootDone(true);
      }
    }, 1000);

    const cursorBlink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorBlink);
    };
  }, []);

  useEffect(() => {
    if (!bootDone) return;

    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'y') {
        navigate('/recovery-1');
      } else if (key === 'n') {
        setLines((prev) => [...prev, '> ACCESS DENIED']);
      } else {
        setLines((prev) => [...prev, `> Invalid input: "${e.key}"`]);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [bootDone, navigate]);

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      height: '100vh',
      padding: '2rem',
      whiteSpace: 'pre-wrap'
    }}>
      {lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
      {bootDone && (
        <div>{showCursor ? '> █' : '> '}</div>
      )}
    </div>
  );
}

export default Trace;
