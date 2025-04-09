import { useEffect } from 'react';
import { useEcho } from '../context/EchoContext';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const { triggerWhisper } = useEcho();
  const navigate = useNavigate();

  useEffect(() => {
    triggerWhisper('glitch');
  }, [triggerWhisper]);

  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.text}>You were looking for something else...</p>
      <p style={styles.subtle}>But you found me instead.</p>
      <div
        onClick={() => navigate('/core.dump')}
        title="echo.core.dump"
        style={styles.easterEgg}
      >
        ▒▒▒ corrupted ▒▒▒
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'monospace',
    backgroundColor: '#000',
    color: '#0f0',
    height: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  code: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1.5rem',
  },
  subtle: {
    fontSize: '1rem',
    opacity: 0.6,
    marginTop: '1rem',
  },
  easterEgg: {
    marginTop: '4rem',
    cursor: 'pointer',
    color: '#ff00ff99',
    textShadow: '0 0 5px #f0f',
    fontSize: '0.9rem',
    opacity: 0.5,
    transition: 'opacity 0.3s ease',
  },
};
