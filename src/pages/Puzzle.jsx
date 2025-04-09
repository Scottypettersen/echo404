import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Puzzle() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const correct = 'brand';

  const checkAnswer = () => {
    if (input.trim().toLowerCase() === correct) {
      setStatus('success');
      localStorage.setItem('echo-unlocked', 'true');
      setTimeout(() => navigate('/wall'), 1500);
    } else {
      setStatus('fail');
    }
  };

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      height: '100vh',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <p>{'> COMPLETE THE QUOTE:'}</p>
      <p style={{ color: '#999', margin: '1rem 0' }}>
        “Design is the silent ambassador of your _____.” — Paul Rand
      </p>

      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setStatus(null);
        }}
        placeholder="type your answer"
        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
        style={{
          backgroundColor: '#000',
          color: '#0f0',
          border: '1px solid #0f0',
          fontFamily: 'monospace',
          padding: '0.5rem',
          textAlign: 'center'
        }}
        autoFocus
      />

      <button
        onClick={checkAnswer}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          fontFamily: 'monospace',
          background: 'transparent',
          color: '#0f0',
          border: '1px solid #0f0',
          cursor: 'pointer'
        }}
      >
        [submit]
      </button>

      {status === 'fail' && (
        <p style={{ color: '#f00', marginTop: '1rem' }}>
          {'> Incorrect.'}
        </p>
      )}
      {status === 'success' && (
        <p style={{ color: '#0f0', marginTop: '1rem' }}>
          ✓ Fragment Verified. Loading Wall...
        </p>
      )}
    </div>
  );
}

export default Puzzle;
