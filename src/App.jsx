// src/App.jsx
import Whisper from './components/Whisper';

function App() {
  return (
    <div style={{ color: '#0f0', backgroundColor: '#000', height: '100vh', padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Echo404 Debug Mode</h1>
      <p>If you see this, React is rendering properly.</p>
      <Whisper />
    </div>
  );
}

export default App;
