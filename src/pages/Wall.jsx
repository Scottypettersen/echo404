import { useState } from 'react';

const ROWS = 25;
const COLS = 40;

function Wall() {
  const [grid, setGrid] = useState(
    Array.from({ length: ROWS * COLS }, () => ({
      claimed: false,
      color: '#0f0',
      label: '',
    }))
  );
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState({ color: '#0f0', label: '' });
  const [log, setLog] = useState([]);

  const handleClaim = (index) => {
    if (!grid[index].claimed) {
      setActiveIndex(index);
    }
  };

  const submitClaim = () => {
    if (formData.label.trim() === '') return;

    const updatedGrid = [...grid];
    updatedGrid[activeIndex] = {
      claimed: true,
      color: formData.color,
      label: formData.label.slice(0, 3).toUpperCase(), // Limit to 3 chars
    };
    setGrid(updatedGrid);
    setLog([
      `> TRACE ${String(activeIndex).padStart(3, '0')} — claimed by "${formData.label.toUpperCase()}"`,
      ...log,
    ]);
    setActiveIndex(null);
    setFormData({ color: '#0f0', label: '' });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Echo Wall</h1>
      <p style={styles.subtitle}>Click a tile to leave your trace.</p>

      <div style={styles.gridWrapper}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 24px)`,
          gap: '2px',
          justifyContent: 'center'
        }}>
          {grid.map((tile, index) => (
            <div
              key={index}
              onClick={() => handleClaim(index)}
              title={tile.claimed ? tile.label : `Tile #${index}`}
              style={{
                ...styles.tile,
                backgroundColor: tile.claimed ? tile.color : '#111',
                color: tile.claimed ? '#0f0' : 'transparent',
                cursor: tile.claimed ? 'default' : 'pointer'
              }}
            >
              {tile.claimed ? tile.label : ''}
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={styles.terminalLine}>> Claiming square #{activeIndex}</p>
          <input
            type="text"
            placeholder="Label or name"
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
          <button onClick={submitClaim} style={styles.button}>[submit]</button>
        </div>
      )}

      <div style={styles.logContainer}>
        {log.map((line, idx) => (
          <div key={idx} style={styles.terminalLine}>{line}</div>
        ))}
      </div>
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
    transition: 'all 0.2s ease-in-out',
  },
  input: {
    backgroundColor: '#000',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    padding: '0.25rem',
    marginTop: '0.5rem',
  },
  button: {
    marginLeft: '1rem',
    background: 'transparent',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    padding: '0.4rem 1rem',
    cursor: 'pointer',
  },
  logContainer: {
    marginTop: '1.5rem',
    width: '100%',
    maxHeight: '150px',
    overflowY: 'auto',
    textAlign: 'left',
  },
  terminalLine: {
    fontSize: '0.75rem',
    lineHeight: '1.3',
  }
};

export default Wall;
