// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Trace from './pages/Trace';
import Recovery1 from './pages/Recovery1';
import Restore from './pages/Restore';
import Wall from './pages/Wall';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Trace />} />
      <Route path="/recovery-1" element={<Recovery1 />} />
      <Route path="/restore" element={<Restore />} />
      <Route path="/wall" element={<Wall />} />
    </Routes>
  );
}

export default App;
