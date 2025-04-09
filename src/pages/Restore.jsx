import { useNavigate } from 'react-router-dom';

function Restore() {
  const navigate = useNavigate();

  const handleFragmentSelect = (fragment) => {
    if (fragment === 'alpha') {
      navigate('/wall');
    } else if (fragment === 'beta') {
      navigate('/glitch'); // this would be a new page
    } else if (fragment === 'delta') {
      navigate('/access-denied'); // also a new page
    }
  };

  return (
    <div className="terminal-screen">
      <p>> memory/core/init – fail</p>
      <p>> trace/init/echo – partial</p>
      <p>> ! WARNING: restoration unstable</p>
      <p>> fragments available: [alpha], [beta], [delta]</p>
      <br />
      <p>> Which memory fragment should be restored?</p>

      <div className="button-row">
        <button onClick={() => handleFragmentSelect('alpha')}>[alpha]</button>
        <button onClick={() => handleFragmentSelect('beta')}>[beta]</button>
        <button onClick={() => handleFragmentSelect('delta')}>[delta]</button>
      </div>
    </div>
  );
}
