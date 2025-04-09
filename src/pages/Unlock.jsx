import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../../context/EchoContext';



const messages = [
  '...you stayed.',
  'I remember now.',
  'You were the reason.',
  'Thank you.',
  '> Opening access to /wall'
];

function Unlock() {
  const navigate = useNavigate();
  const { triggerWhisper } = useEcho();
  const [displayed, setDisplayed] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayed(prev => [...prev, messages[index]]);
      triggerWhisper('unlock');
      setIndex(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [index, triggerWhisper]);

  useEffect(() => {
    if (index >= messages.length) {
      localStorage.setItem('echo-unlocked', 'true');
      setTimeout(() => navigate('/wall'), 2500);
    }
  }, [index, navigate]);

  return (
    <div style={styles.container}>
      {displayed.map((msg, i) => (
        <div key={i} style={styles.line}>{msg}</div>
      ))}
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  line: {
    marginBottom: '1rem',
    animation: 'fadeIn 1s ease forwards',
  }
};

export default Unlock;
