import { Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import Whisper from './components/Whisper';

// Start simple — add more pages after this works
import Access from './pages/Access';
import NotFound from './pages/NotFound';

export default function App() {
=======

// Core narrative flow
import Trace from './pages/Trace';
import Recovery1 from './pages/Recovery1';
import WallGate from './pages/WallGate';
import Unlock from './pages/Unlock';
import Puzzle from './pages/Puzzle';

// Puzzle paths
import Access from './pages/Access';       // Puzzle 1: Quote
import Access2 from './pages/Access2';     // Puzzle 2: Magic phrase
import Access3 from './pages/Access3';     // Puzzle 3: Tile rearrange

// Branches and errors
import Glitch from './pages/Glitch';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import CoreDump from './pages/CoreDump';


function App() {
>>>>>>> parent of b7caf80 (whisper?)
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
