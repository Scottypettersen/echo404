import { useEffect, useState } from 'react';

function Glitch() {
  const [echoLine, setEchoLine] = useState('');
  const lines = [
    '>> SYSTEM ERROR',
    '>> memory/beta/restore failed',
    '>> fragment corrupted…',
    '>> attempting visual recovery…',
  ];

  useEffect(() => {
    setTimeout(() => {
      setEchoLine('> [echo] i don’t know what parts of me are still me');
    }, 3000);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.glitchBox}>
        {lines.map((line, idx) => (
          <div key={idx} className="glitchLine">{line}</div>
        ))}

        {echoLine && (
          <div style={styles.echo} className="glitchWhisper">
            {echoLine}
          </div>
        )}
      </div>

      {/* Glitch animation */}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.2; }
          55% { opacity: 1; }
        }

        .glitchLine {
          animation: flicker 1.2s infinite;
        }

        .glitchWhisper {
          color: #f0f;
          font-style: italic;
          text-shadow: 0 0 3px #f0f, 0 0 5px #0ff;
          animation: flicker 0.7s infinite;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    whiteSpace: 'pre-wrap',
  },
  glitchBox: {
    width: '100%',
    maxWidth: '600px',
    textAlign: 'left',
  },
  echo: {
    marginTop: '2rem',
  }
};

export default Glitch;
