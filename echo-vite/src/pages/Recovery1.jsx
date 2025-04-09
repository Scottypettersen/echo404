import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const logLines = [
  ">> memory/core/init - fail",
  ">> node/system/mem-03 - missing",
  ">> trace/init/echo - partial",
  ">> ! WARNING: restoration unstable",
  ">> fragments available: [alpha], [beta], [delta]"
];

function Recovery1() {
  const [lines, setLines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLines(prev => [...prev, logLines[i]]);
      i++;
      if (i === logLines.length) clearInterval(interval);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleChoice = (fragment) => {
    if (fragment === 'alpha') {
      navigate('/restore');
    } else if (fragment === 'beta') {
      navigate('/wall');
    } else {
      alert('Fragment data corrupted.');
    }
  };

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

      {lines.length === logLines.length && (
        <div style={{ marginTop: '2rem' }}>
          <div>> Which memory fragment should be restored?</div>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => handleChoice('alpha')} style={btnStyle}>[alpha]</button>
            <button onClick={() => handleChoice('beta')} style={btnStyle}>[beta]</button>
            <button onClick={() => handleChoice('delta')} style={btnStyle}>[delta]</button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  backgroundColor: 'transparent',
  color: '#0f0',
  border: '1px solid #0f0',
  fontFamily: 'monospace',
  padding: '0.5rem 1rem',
  marginRight: '1rem',
  cursor: 'pointer'
};

export default Recovery1;
