// src/components/RequireFlag.jsx
import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEcho } from '../context/EchoContext';

export default function RequireFlag({
  flag,
  redirect = '/trace',
  children,
  // optional knobs
  bump = 1,                 // how much entropy to add on blocked route
  reason = 'ROUTE_GUARD',    // event reason tag
  once = true,              // prevent spam if StrictMode / rerenders
}) {
  const location = useLocation();
  const { getFlag, emit, bumpEntropy, setWhisper } = useEcho();

  const allowed = getFlag(flag);

  // Prevent duplicate emit/bump in StrictMode or rerenders
  const firedRef = useRef(false);

  useEffect(() => {
    if (allowed) return;

    if (once && firedRef.current) return;
    firedRef.current = true;

    // Telemetry
    emit('ROUTE_BLOCKED', {
      requiredFlag: flag,
      from: location.pathname,
      redirectTo: redirect,
      reason,
    });

    // Narrative feedback
    setWhisper('... ACCESS VIOLATION DETECTED');

    // Pressure / corruption mechanic
    if (typeof bumpEntropy === 'function' && bump) {
      bumpEntropy(bump, `Blocked route: ${location.pathname} requires ${flag}`);
    }
  }, [allowed, bump, bumpEntropy, emit, flag, location.pathname, redirect, reason, once, setWhisper]);

  if (!allowed) {
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
