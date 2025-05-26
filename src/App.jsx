// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import Whisper from './components/Whisper';

import Access from './pages/Access';
import Access2 from './pages/Access2';
import Access3 from './pages/Access3';
import AccessDenied from './pages/AccessDenied';
import CoreDump from './pages/CoreDump';
import Glitch from './pages/Glitch';
import Puzzle from './pages/Puzzle';
import Recovery1 from './pages/Recovery1';
import Trace from './pages/Trace';
import Unlock from './pages/Unlock';
import WallGate from './pages/WallGate';
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
