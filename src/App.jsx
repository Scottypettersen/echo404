// src/App.jsx
import { Routes, Route } from 'react-router-dom';

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
  return (
    <Routes>
      {/* Narrative flow */}
      <Route path="/" element={<Trace />} />
      <Route path="/recovery-1" element={<Recovery1 />} />
      <Route path="/unlock" element={<Unlock />} />
      <Route path="/wall" element={<WallGate />} />
      <Route path="/puzzle" element={<Puzzle />}
       /><Route path="/core.dump" element={<CoreDump />} />
      <Route path="*" element={<NotFound />} />

      {/* Puzzle sequence */}
      <Route path="/access" element={<Access />} />
      <Route path="/access-2" element={<Access2 />} />
      <Route path="/access-3" element={<Access3 />} />

      {/* Branches / detours */}
      <Route path="/glitch" element={<Glitch />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Future: 404 fallback could be added here */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
