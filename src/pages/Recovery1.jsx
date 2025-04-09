import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const bootLines = [
  '>> memory/core/init – fail',
  '>> trace/init/echo – partial',
  '>> ! WARNING: restoration unstable',
  '>> fragments available: [alpha], [beta], [delta]',
  '>> Which memory fragment should be restored?'
];

const prompts = {
  alpha: {
    question: '"_______ , but better." — Dieter Rams',
    answer: 'less but better',
    redirect: '/puzzle'
  },
  beta: {
    question: '"Design is ____________." — Saul Bass',
    answer: 'thinking made visual',
    redirect: '/access'
  },
  delta: {
    question: '"magic phrase:" [from HTML comment]',
    answer: 'hello.echo',
    redirect: '/access-2'
  }
};

function Recovery1() {
  const [lines, setLines] = useState([]);
  const [step, setStep] = useState('boot'); // 'boot', 'select', 'prompt', 'error'
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Boot sequence
  useEffect(() => {
    if (step !== 'boot') return;

    let i = 0;
    const interval = setInterval(() => {
      setLines(prev => [...prev, bootLines[i]]);
      i++;
      if (i === bootLines.length) {
        clearInterval(interval);
        setStep('select');
      }
    }, 600);

    return () => clearInterval(interval);
  }, [step]);

  const handleFragmentSelect = (fragment) => {
    setSelected(fragment);
    setLines(prev => [...prev, `>> restore/${fragment}.chk – corrupted`, '>> Validate memory:']);
    setTimeout(() => setStep('prompt'), 500);
  };

  const handleSubmit = () => {
    const normalizedInput = input.trim().toLowerCase();
    const { answer, redirect } = prompts[selected];

    if (normalizedInput === answer) {
      navigate(redirect);
    } else {
      setError(`>> Input "${input}" not recognized. Fragment unstable.`);
    }
  };

  return (
    <div style={styles.container}>
      {lines.map((line, idx) => (
        <div key={idx} style={styles.line}>{line}</div>
      ))}

      {step === 'select' && (
        <div style={{ marginTop: '1rem' }}>
          {['alpha', 'beta', 'delta'].map(frag => (
            <button key={frag} onClick={() => handleFragmentSelect(frag)} style={styles.button}>
              [{frag}]
            </button>
          ))}
        </div>
      )}

      {step === 'prompt' && selected && (
        <div style={{ marginTop: '2rem' }}>
          <div style={styles.line}>{prompts[selected].question}</div>
          <input
            type="text"
            value={input}
            placeholder="Type to restore fragment..."
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={styles.input}
          />
          <button onClick={handleSubmit} style={styles.submit}>[submit]</button>
          {error && <div style={{ color: '#f00', marginTop: '0.5rem' }}>{error}</div>}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    height: '100vh',
    padding: '2rem',
    whiteSpace: 'pre-wrap'
  },
  line: {
    marginBottom: '0.4rem'
  },
  button: {
    backgroundColor: '#111',
    color: '#0f0',
    fontFamily: 'monospace',
    border: '1px solid #0f0',
    padding: '0.4rem 1rem',
    marginRight: '1rem',
    cursor: 'pointer'
  },
  input: {
    backgroundColor: '#000',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    padding: '0.5rem',
    width: '300px',
    marginTop: '1rem'
  },
  submit: {
    marginLeft: '1rem',
    background: 'transparent',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '0.4rem 1rem',
    fontFamily: 'monospace',
    cursor: 'pointer'
  }
};

export default Recovery1;
