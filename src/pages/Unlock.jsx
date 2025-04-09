import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Unlock() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/wall');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h1>> GATEWAY UNLOCKED</h1>
      <p style={{ marginTop: '0.5rem' }}>Routing to Echo Wall...</p>
    </div>
  );
}

export default Unlock;
