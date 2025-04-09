// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Trace from './pages/Trace';
import Recovery1 from './pages/Recovery1';
import Restore from './pages/Restore';
import WallGate from './pages/WallGate';
import Access from './pages/Access';       // Puzzle 1: Complete the quote
import Access2 from './pages/Access2';     // Puzzle 2: Magic phrase
import Access3 from './pages/Access3';     // Puzzle 3: Tile reorder
import Unlock from './pages/Unlock';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Trace />} />
      <Route path="/recovery-1" element={<Recovery1 />} />
      <Route path="/restore" element={<Restore />} />
      <Route path="/wall" element={<WallGate />} />
      <Route path="/unlock" element={<Unlock />} />


      {/* Puzzle path */}
      <Route path="/access" element={<Access />} />
      <Route path="/access-2" element={<Access2 />} />
      <Route path="/access-3" element={<Access3 />} />
    </Routes>
  );
}

export default App;
