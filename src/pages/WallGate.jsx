import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wall from './Wall';

function WallGate() {
  const navigate = useNavigate();

  useEffect(() => {
    const unlocked = localStorage.getItem('echo-unlocked');
    if (!unlocked) {
      navigate('/access');
    }
  }, [navigate]);

  return <Wall />;
}

export default WallGate;
