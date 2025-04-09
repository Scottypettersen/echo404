import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Access2() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const correctPhrase = 'hello.echo';

  const checkInput = () => {
    if (input.trim().toLowerCase() === correctPhrase) {
      setStatus('success');
      setTimeout(() => navigate('/access-3'), 1200);
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
      <p style={{ marginBottom: '1rem' }}>
        > ECHO: ██████████  
      </p>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>(Hint: It's hidden in the static...)</p>

      <input
        type="text"
        value={input}
        placeholder="magic phrase"
        onChange={(e) => {
          setInput(e.target.value);
          setStatus(null);
        }}
        onKeyDown={(e) => e.key === 'Enter' && checkInput()}
        style={{
          backgroundColor: '#000',
          color: '#0f0',
          border: '1px solid #0f0',
          fontFamily: 'monospace',
          padding: '0.5rem',
          width: '250px',
          textAlign: 'center',
          marginTop: '1rem'
        }}
      />

      <button
        onClick={checkInput}
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
          > Incorrect input. Signal not recognized.
        </p>
      )}
      {status === 'success' && (
        <p style={{ color: '#0f0', marginTop: '1rem' }}>
          ✓ Signal accepted.
        </p>
      )}
    </div>
  );
}

export default Access2;
