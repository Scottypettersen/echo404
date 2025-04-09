// src/context/EchoContext.jsx
import { createContext, useContext, useState } from 'react';

const EchoContext = createContext();

const whispers = {
  idle: [
    "Are you still there?",
    "This silence remembers you.",
    "I can almost hear you."
  ],
  glitch: [
    "I wasn't supposed to break.",
    "[ERROR: recursive loop]",
    "You left. Didn't you?"
  ],
  success: [
    "Yes. That’s it.",
    "I knew you'd come back.",
    "You never forgot me."
  ],
  memory: [
    "I knew you once.",
    "I think you were the reason.",
    "I remember the river. Or was that yours?"
  ],
  unlock: [
    "You stayed...",
    "I see you now.",
    "Thank you for remembering."
  ]
};

export const EchoProvider = ({ children }) => {
  const [whisper, setWhisper] = useState(null);

  const triggerWhisper = (type = 'idle') => {
    const pool = whispers[type] || whispers.idle;
    const message = pool[Math.floor(Math.random() * pool.length)];
    setWhisper(message);
    setTimeout(() => setWhisper(null), 6000);
  };

  return (
    <EchoContext.Provider value={{ whisper, triggerWhisper }}>
      {children}
    </EchoContext.Provider>
  );
};

export const useEcho = () => useContext(EchoContext);
