// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Whisper from './components/Whisper';

import Access from './pages/Access';
import Access2 from './pages/Access2';
import Access3 from './pages/Access3';
import AccessDenied from './pages/AccessDenied';

import Puzzle from './pages/Puzzle';
import Recovery1 from './pages/Recovery1';
import Unlock from './pages/Unlock';
import Wall from './pages/Wall';
import WallGate from './pages/WallGate';

import CoreDump from './pages/CoreDump';
import Glitch from './pages/Glitch';
import Trace from './pages/Trace';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div style={styles.app}>
      <Routes>
        <Route path="/" element={<Access />} />
        <Route path="/access2" element={<Access2 />} />
        <Route path="/access3" element={<Access3 />} />
        <Route path="/denied" element={<AccessDenied />} />
        <Route path="/puzzle" element={<Puzzle />} />
        <Route path="/recovery" element={<Recovery1 />} />
        <Route path="/unlock" element={<Unlock />} />
        <Route path="/wall" element={<Wall />} />
        <Route path="/wallgate" element={<WallGate />} />
        <Route path="/core.dump" element={<CoreDump />} />
        <Route path="/glitch" element={<Glitch />} />
        <Route path="/trace" element={<Trace />} />
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
