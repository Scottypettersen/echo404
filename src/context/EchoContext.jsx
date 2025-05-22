import { createContext, useContext, useState } from 'react';

const EchoContext = createContext();

export function EchoProvider({ children }) {
  const [whisper, setWhisper] = useState('');

  return (
    <EchoContext.Provider value={{ whisper, setWhisper }}>
      {children}
    </EchoContext.Provider>
  );
}

export function useEcho() {
  return useContext(EchoContext);
}
