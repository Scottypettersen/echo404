// src/pages/AccessDenied.jsx
function AccessDenied() {
    return (
      <div
        style={{
          backgroundColor: '#100',
          color: '#f00',
          fontFamily: 'monospace',
          padding: '2rem',
          minHeight: '100vh',
          textShadow: '0 0 5px #f00',
        }}
      >
        <h1 style={{ fontSize: '2rem' }}>ACCESS DENIED</h1>
        <p>Unauthorized memory fragment: delta</p>
        <p style={{ marginTop: '2rem' }}>
          ✖ Terminal locked.<br />
          ✖ Trace halted.<br />
          Return to safe fragment or initiate override…
        </p>
      </div>
    );
  }
  
  export default AccessDenied;
  