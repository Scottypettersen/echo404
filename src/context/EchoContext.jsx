// src/context/EchoContext.jsx
import { createContext, useContext, useState } from 'react';

// Initialize with a default shape to avoid undefined
const EchoContext = createContext({
  whisper: '',
  setWhisper: () => {},
});

export function EchoProvider({ children }) {
  const [whisper, setWhisper] = useState('');

  return (
    <EchoContext.Provider value={{ whisper, setWhisper }}>
      {children}
    </EchoContext.Provider>
  );
}

export function useEcho() {
  const context = useContext(EchoContext);
  if (context === undefined) {
    throw new Error('useEcho must be used within an EchoProvider');
  }
  return context;
}
