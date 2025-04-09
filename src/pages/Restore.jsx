import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Restore() {
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSelection = (fragment) => {
    setSelected(fragment);
    setInput('');
    setError('');
  };

  const checkPuzzle = () => {
    const answers = {
      alpha: 'less, but better',
      beta: 'thinking made visual',
      delta: 'hello.echo'
    };

    const redirect = {
      alpha: '/puzzle',      // Quote puzzle
      beta: '/access',       // Access path 1
      delta: '/access-2'     // Magic phrase
    };

    if (input.toLowerCase().trim() === answers[selected]) {
      navigate(redirect[selected]);
    } else {
      setError('>> incorrect. try again.');
    }
  };

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      height: '100vh',
      padding: '2rem'
    }}>
      {!selected ? (
        <>
          <p>{'> memory/core/init – fail'}</p>
          <p>{'> trace/init/echo – partial'}</p>
          <p>{'> ! WARNING: restoration unstable'}</p>
          <p>{'> fragments available: [alpha], [beta], [delta]'}</p>
          <br />
          <p>{'> Which memory fragment should be restored?'}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {['alpha', 'beta', 'delta'].map(f => (
              <button key={f} onClick={() => handleSelection(f)}>[{f}]</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p>{`> restore/${selected}.chk – corrupted`}</p>
          <p>{'> validate memory by completing the phrase:'}</p>
          <p style={{ color: '#999' }}>
            {selected === 'alpha' && '"_______ , but better." — Dieter Rams'}
            {selected === 'beta' && '"Design is ____________." — Saul Bass'}
            {selected === 'delta' && '"magic phrase:" [from HTML comment]'}
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer"
            style={{ marginTop: '1rem', padding: '0.5rem' }}
          />
          <button onClick={checkPuzzle} style={{ marginLeft: '1rem' }}>[submit]</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
}

export default Restore;
