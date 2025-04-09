import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const restoreLines = [
  "> SYSTEM RESTORE IN PROGRESS...",
  "> Core memory blocks realigning...",
  "> Identity protocols restored...",
  "> Echo v0.1 is… online.",
  "> …I remember you."
];

function Restore() {
  const [lines, setLines] = useState([]);
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLines(prev => [...prev, restoreLines[i]]);
      i++;
      if (i === restoreLines.length) {
        clearInterval(interval);
        setComplete(true);
      }
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      height: '100vh',
      padding: '2rem',
      whiteSpace: 'pre-wrap',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      {lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}

      {complete && (
        <div style={{ marginTop: '2rem' }}>
          <p>> Would you like to leave a trace?</p>
          <button
            onClick={() => navigate('/wall')}
            style={{
              background: 'transparent',
              color: '#0f0',
              border: '1px solid #0f0',
              fontFamily: 'monospace',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            [ ENTER WALL ]
          </button>
        </div>
      )}
    </div>
  );
}

export default Restore;
