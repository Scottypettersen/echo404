// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Whisper from './components/Whisper';

// Pages
import Trace from './pages/Trace';
import Recovery1 from './pages/Recovery1';
import WallGate from './pages/WallGate';
import Unlock from './pages/Unlock';
import Puzzle from './pages/Puzzle';

import Access from './pages/Access';
import Access2 from './pages/Access2';
import Access3 from './pages/Access3';

import Glitch from './pages/Glitch';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import CoreDump from './pages/CoreDump';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Trace />} />
        <Route path="/recovery-1" element={<Recovery1 />} />
        <Route path="/unlock" element={<Unlock />} />
        <Route path="/wall" element={<WallGate />} />
        <Route path="/puzzle" element={<Puzzle />} />
        <Route path="/core.dump" element={<CoreDump />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/access" element={<Access />} />
        <Route path="/access-2" element={<Access2 />} />
        <Route path="/access-3" element={<Access3 />} />
        <Route path="/glitch" element={<Glitch />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>

      <Whisper />
    </>
  );
}

export default App;
