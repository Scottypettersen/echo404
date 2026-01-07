// src/context/EchoContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'echo404_state_v1';

function safeParseObject(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v && typeof v === 'object' ? v : fallback;
  } catch {
    return fallback;
  }
}

function nowISO() {
  return new Date().toISOString();
}

function readStore() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return safeParseObject(raw, null);
}

function writeStore(payload) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

const EchoContext = createContext(null);

export function EchoProvider({ children }) {
  // --- Core state ---
  const [whisper, setWhisper] = useState('');

  // Load persisted data once (single read)
  const boot = useMemo(() => readStore(), []);

  // flags power your route guards
  const [flags, setFlags] = useState(() => boot?.flags && typeof boot.flags === 'object' ? boot.flags : {});

  // event log powers Trace + “graph” later
  const [events, setEvents] = useState(() => (Array.isArray(boot?.events) ? boot.events : []));

  // entropy is your “corruption / glitch pressure” knob
  const [entropy, setEntropy] = useState(() => {
    const n = Number(boot?.entropy ?? 0);
    return Number.isFinite(n) ? n : 0;
  });

  // --- Persistence ---
  useEffect(() => {
    writeStore({ flags, events, entropy });
  }, [flags, events, entropy]);

  // --- API: flags ---
  const getFlag = useCallback(
    (key) => Boolean(flags?.[String(key)]),
    [flags]
  );

  const setFlag = useCallback((key, value = true) => {
    const k = String(key);
    setFlags((prev) => ({
      ...(prev || {}),
      [k]: Boolean(value),
    }));
  }, []);

  const clearFlag = useCallback((key) => {
    const k = String(key);
    setFlags((prev) => {
      const next = { ...(prev || {}) };
      delete next[k];
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setWhisper('');
    setFlags({});
    setEvents([]);
    setEntropy(0);
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  // --- API: events / telemetry ---
  const emit = useCallback((type, data = {}) => {
    const entry = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      t: nowISO(),
      type: String(type),
      data: data ?? {},
    };

    setEvents((prev) => {
      const next = [entry, ...(prev || [])];
      return next.slice(0, 250); // slightly higher cap, still safe
    });
  }, []);

  // --- API: entropy ---
  const bumpEntropy = useCallback(
    (amount = 1, reason = '') => {
      const n = Number(amount);
      if (!Number.isFinite(n) || n === 0) return;

      setEntropy((prev) => Math.max(0, Number(prev || 0) + n));
      emit('ENTROPY_BUMP', { amount: n, reason: String(reason || '') });
    },
    [emit]
  );

  // Nice consolidated object so consumers don’t rerender excessively
  const value = useMemo(
    () => ({
      whisper,
      setWhisper,

      flags,
      getFlag,
      setFlag,
      clearFlag,

      events,
      emit,

      entropy,
      bumpEntropy,

      resetAll,
    }),
    [
      whisper,
      flags,
      getFlag,
      setFlag,
      clearFlag,
      events,
      emit,
      entropy,
      bumpEntropy,
      resetAll,
    ]
  );

  return <EchoContext.Provider value={value}>{children}</EchoContext.Provider>;
}

export function useEcho() {
  const ctx = useContext(EchoContext);
  if (!ctx) throw new Error('useEcho must be used within an EchoProvider');
  return ctx;
}
