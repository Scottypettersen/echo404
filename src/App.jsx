import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Whisper from './components/Whisper';

// Core narrative flow
import Trace from './pages/Trace';
import Recovery1 from './pages/Recovery1';
import WallGate from './pages/WallGate';
import Unlock from './pages/Unlock';
import Puzzle from './pages/Puzzle';

// Puzzle gates
import Access1 from './pages/Access';     // renamed for clarity
import Access2 from './pages/Access2';
import Access3 from './pages/Access3';

// Branches and fallbacks
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
        {/* Redirect root to puzzle start */}
        <Route path="/" element={<Navigate to="/access1" replace />} />

        {/* Puzzle progression */}
        <Route path="/access1" element={<Access1 />} />
        <Route path="/access2" element={<Access2 />} />
        <Route path="/access3" element={<Access3 />} />

        {/* Narrative & core paths */}
        <Route path="/puzzle" element={<Puzzle />} />
        <Route path="/trace" element={<Trace />} />
        <Route path="/recovery-1" element={<Recovery1 />} />
        <Route path="/unlock" element={<Unlock />} />
        <Route path="/wall" element={<WallGate />} />

        {/* Side branches and fallback */}
        <Route path="/glitch" element={<Glitch />} />
        <Route path="/denied" element={<AccessDenied />} />
        <Route path="/core.dump" element={<CoreDump />} />
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
