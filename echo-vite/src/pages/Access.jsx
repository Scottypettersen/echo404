import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Access() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const correctAnswer = 'take away';

  const checkAnswer = () => {
    if (input.trim().toLowerCase() === correctAnswer) {
      setStatus('success');
      setTimeout(() => navigate('/access-2'), 1200);
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
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <p style={{ marginBottom: '1rem', maxWidth: '600px' }}>
        > “A designer knows he has achieved perfection not when there is nothing left to add, but when there is nothing left to _______.”
      </p>

      <input
        type="text"
        value={input}
        placeholder="your answer"
        onChange={(e) => {
          setInput(e.target.value);
          setStatus(null);
        }}
        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
        style={{
          backgroundColor: '#000',
          color: '#0f0',
          border: '1px solid #0f0',
          fontFamily: 'monospace',
          padding: '0.5rem',
          width: '250px',
          textAlign: 'center'
        }}
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
        <p style={{ color: '#f00', marginTop: '1rem' }}>> ACCESS DENIED</p>
      )}
      {status === 'success' && (
        <p style={{ color: '#0f0', marginTop: '1rem' }}>✓ ACCESS FRAGMENT VERIFIED</p>
      )}
    </div>
  );
}

export default Access;
