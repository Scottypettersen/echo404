import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';
import { WHISPERS, pick } from '../echo/whispers';

export default function RequireNode({ requires = [], redirect = '/trace', children }) {
  const { canAccess, whisperOnce } = useEcho();
  const ok = canAccess(requires);

  useEffect(() => {
    if (!ok) {
      whisperOnce('recovery-required', pick(WHISPERS.recovery));
    }
  }, [ok, whisperOnce]);

  if (!ok) return <Navigate to={redirect} replace />;
  return children;
}
