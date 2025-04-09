import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wall from './Wall';

function WallGate() {
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unlocked = localStorage.getItem('echo-unlocked');
    if (unlocked) {
      setAllowed(true);
    } else {
      navigate('/access');
    }
  }, [navigate]);

  if (!allowed) return null;

  return <Wall />;
}

export default WallGate;
