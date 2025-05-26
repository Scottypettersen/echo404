// src/pages/WallGate.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';
import Wall from './Wall';

export default function WallGate() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { setWhisper } = useEcho();

  useEffect(() => {
    const unlocked = localStorage.getItem('echo-unlocked') === 'true';
    if (unlocked) {
      setWhisper('ACCESS GRANTED');
      setIsAllowed(true);
    } else {
      setWhisper('ACCESS DENIED');
      navigate('/access');
    }
    setChecking(false);
  }, [navigate, setWhisper]);

  // While verifying access, render nothing (or a loading cursor)
  if (checking) return null;

  return (
    <main style={styles.container} role="region" aria-label="Echo Wall Gate">
      {isAllowed && <Wall />}
    </main>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    height: '100vh',
    overflow: 'hidden'
  }
};
