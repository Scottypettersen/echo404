import { Routes, Route } from 'react-router-dom';
import Whisper from './components/Whisper';

// Start simple — add more pages after this works
import Access from './pages/Access';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div style={styles.app}>
      <Routes>
        <Route path="/" element={<Access />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Whisper />
    </div>
  );
}

const styles = {
  app: {
    backgroundColor: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    minHeight: '100vh',
    padding: '1rem',
  },
};
