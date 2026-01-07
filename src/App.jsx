// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Whisper from './components/Whisper';
import RequireNode from './components/RequireNode';
import { ECHO_GRAPH } from './echo/graph';

// Core narrative flow
import Trace from './pages/Trace';
import Recovery1 from './pages/Recovery1';
import WallGate from './pages/WallGate';
import Unlock from './pages/Unlock';
import Puzzle from './pages/Puzzle';

// Puzzle gates
import Access1 from './pages/Access';
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
      {/* Global echo whisper overlay (mount once) */}
      <Whisper />

      <Routes>
        {/* Entry */}
        <Route path="/" element={<Navigate to={ECHO_GRAPH.access1.path} replace />} />

        {/* Puzzle progression */}
        <Route path={ECHO_GRAPH.access1.path} element={<Access1 />} />

        <Route
          path={ECHO_GRAPH.access2.path}
          element={
            <RequireNode requires={ECHO_GRAPH.access2.requires} redirect={ECHO_GRAPH.access2.redirect}>
              <Access2 />
            </RequireNode>
          }
        />

        <Route
          path={ECHO_GRAPH.access3.path}
          element={
            <RequireNode requires={ECHO_GRAPH.access3.requires} redirect={ECHO_GRAPH.access3.redirect}>
              <Access3 />
            </RequireNode>
          }
        />

        {/* Core unlocks */}
        <Route
          path={ECHO_GRAPH.puzzle.path}
          element={
            <RequireNode requires={ECHO_GRAPH.puzzle.requires} redirect={ECHO_GRAPH.puzzle.redirect}>
              <Puzzle />
            </RequireNode>
          }
        />

        <Route
          path={ECHO_GRAPH.unlock.path}
          element={
            <RequireNode requires={ECHO_GRAPH.unlock.requires} redirect={ECHO_GRAPH.unlock.redirect}>
              <Unlock />
            </RequireNode>
          }
        />

        <Route
          path={ECHO_GRAPH.wall.path}
          element={
            <RequireNode requires={ECHO_GRAPH.wall.requires} redirect={ECHO_GRAPH.wall.redirect}>
              <WallGate />
            </RequireNode>
          }
        />

        {/* Narrative & side branches (intentionally accessible) */}
        <Route path={ECHO_GRAPH.trace.path} element={<Trace />} />
        <Route path="/recovery-1" element={<Recovery1 />} />
        <Route path="/glitch" element={<Glitch />} />
        <Route path="/denied" element={<AccessDenied />} />
        <Route path="/core.dump" element={<CoreDump />} />

        {/* Fallback */}
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
