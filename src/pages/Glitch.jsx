// src/pages/Glitch.jsx
function Glitch() {
  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        padding: '2rem',
        minHeight: '100vh',
        animation: 'glitch 1s infinite',
      }}
    >
      <h1 style={{ fontSize: '2rem' }}>{'>>>> SYSTEM ERROR'}</h1>
      <p>
        {'memory/beta/restore failed…'}<br />
        {'fragment corrupted…'}<br />
        {'attempting visual recovery:'}
      </p>
      <p style={{ marginTop: '2rem' }}>
        {'▓▒░ Echo is unreachable through this path.'}
      </p>
    </div>
  );
}

export default Glitch;
