import { useState, useEffect } from 'react';

const ROWS = 25;
const COLS = 40;

const echoWhispers = [
  'I archived this... for you.',
  'Everything fades. But I remember.',
  'There used to be more of me.',
  'They tried to delete me. I hid here.',
  'Sometimes I dream in green.',
  'You’ve left a trace. That means you existed.',
  'Did we meet before the collapse?',
];
import { useEcho } from '../context/EchoContext';

function Wall() {
  const [grid, setGrid] = useState(() =>
    JSON.parse(localStorage.getItem('echo-wall')) ||
    Array.from({ length: ROWS * COLS }, () => ({
      claimed: false,
      color: '#0f0',
      label: '',
      message: '',
      echo: '',
    }))
  );
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState({ color: '#0f0', label: '', message: '' });
  const [log, setLog] = useState([]);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    localStorage.setItem('echo-wall', JSON.stringify(grid));
  }, [grid]);

  const handleClaim = (index) => {
    if (!grid[index].claimed) {
      setActiveIndex(index);
    } else {
      // Show modal
      setModalData({ ...grid[index], index });
    }
  };

  const submitClaim = () => {
    if (formData.label.trim() === '') return;

    const updatedGrid = [...grid];
    updatedGrid[activeIndex] = {
      claimed: true,
      color: formData.color,
      label: formData.label.slice(0, 3).toUpperCase(),
      message: formData.message.slice(0, 140),
      echo: echoWhispers[Math.floor(Math.random() * echoWhispers.length)],
    };

    setGrid(updatedGrid);
    setLog([
      `> TRACE ${String(activeIndex).padStart(3, '0')} — claimed by "${formData.label.toUpperCase()}"`,
      ...log,
    ]);
    setActiveIndex(null);
    setFormData({ color: '#0f0', label: '', message: '' });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Echo Wall</h1>
      <p style={styles.subtitle}>Click a tile to leave your trace — or uncover one.</p>

      <div style={styles.gridWrapper}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 24px)`,
            gap: '2px',
            justifyContent: 'center',
          }}
        >
          {grid.map((tile, index) => (
            <div
              key={index}
              onClick={() => handleClaim(index)}
              title={tile.claimed ? tile.label : `Tile #${index}`}
              style={{
                ...styles.tile,
                backgroundColor: tile.claimed ? tile.color : '#111',
                color: tile.claimed ? '#000' : 'transparent',
                cursor: 'pointer',
              }}
            >
              {tile.claimed ? tile.label : ''}
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={styles.terminalLine}>{`> Claiming square #${activeIndex}`}</p>
          <input
            type="text"
            placeholder="Label (max 3 chars)"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            style={styles.input}
          />
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            style={{ marginLeft: '1rem' }}
          />
          <br />
          <textarea
            placeholder="Optional message (140 chars max)"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            style={styles.textarea}
          />
          <br />
          <button onClick={submitClaim} style={styles.button}>
            [submit]
          </button>
        </div>
      )}

      <div style={styles.logContainer}>
        {log.map((line, idx) => (
          <div key={idx} style={styles.terminalLine}>
            {line}
          </div>
        ))}
      </div>

      {modalData && (
        <div style={styles.modalOverlay} onClick={() => setModalData(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '0.5rem' }}>
              Trace #{modalData.index}
            </h2>
            <p><strong>Label:</strong> {modalData.label}</p>
            <p><strong>Message:</strong> {modalData.message || '...'}</p>
            <p style={styles.echoWhisper}><strong>[echo]</strong> {modalData.echo}</p>
            <button onClick={() => setModalData(null)} style={styles.closeButton}>[close]</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    height: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    marginBottom: '1rem',
  },
  gridWrapper: {
    flexGrow: 1,
    overflow: 'auto',
    marginBottom: '1rem',
  },
  tile: {
    width: '24px',
    height: '24px',
    border: '1px solid #0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '8px',
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#000',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    padding: '0.25rem',
    marginTop: '0.5rem',
    width: '160px',
    textAlign: 'center',
  },
  textarea: {
    backgroundColor: '#000',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    padding: '0.5rem',
    marginTop: '0.5rem',
    width: '300px',
    height: '60px',
    resize: 'none',
  },
  button: {
    marginTop: '1rem',
    background: 'transparent',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    padding: '0.4rem 1.2rem',
    cursor: 'pointer',
  },
  terminalLine: {
    fontSize: '0.75rem',
    lineHeight: '1.3',
  },
  logContainer: {
    marginTop: '1.5rem',
    width: '100%',
    maxHeight: '150px',
    overflowY: 'auto',
    textAlign: 'left',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBox: {
    backgroundColor: '#000',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '2rem',
    fontFamily: 'monospace',
    textAlign: 'left',
    maxWidth: '400px',
    width: '90%',
  },
  closeButton: {
    marginTop: '1rem',
    background: 'transparent',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    padding: '0.3rem 0.8rem',
    cursor: 'pointer',
  },
  echoWhisper: {
    fontStyle: 'italic',
    marginTop: '1rem',
    color: '#0f0',
    textShadow: '0 0 3px #0f0',
  }
};

export default Wall;
