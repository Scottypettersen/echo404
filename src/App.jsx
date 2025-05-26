// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Whisper from './components/Whisper';

// Core narrative flow
import Trace from './pages/Trace';
import Recovery1 from './pages/Recovery1';
import WallGate from './pages/WallGate';
import Unlock from './pages/Unlock';
import Puzzle from './pages/Puzzle';

// Puzzle paths
import Access from './pages/Access';
import Access2 from './pages/Access2';
import Access3 from './pages/Access3';

// Branches and errors
import Glitch from './pages/Glitch';
import AccessDenied from './pages/AccessDenied';
import CoreDump from './pages/CoreDump';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div style={styles.app}>
      {/* Global echo whisper overlay */}
      <Whisper />

      <Routes>
        <Route path="/" element={<Access />} />
        <Route path="/access-2" element={<Access2 />} />
        <Route path="/access-3" element={<Access3 />} />
        <Route path="/denied" element={<AccessDenied />} />
        <Route path="/core.dump" element={<CoreDump />} />
        <Route path="/glitch" element={<Glitch />} />
        <Route path="/puzzle" element={<Puzzle />} />
        <Route path="/recovery-1" element={<Recovery1 />} />
        <Route path="/trace" element={<Trace />} />
        <Route path="/unlock" element={<Unlock />} />
        <Route path="/wall-gate" element={<WallGate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
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
