import { useEffect } from 'react';
import { useEcho } from '../context/EchoContext'; // ✅ correct


const logs = [
  "> log_01: 'memory access granted...'",
  "> log_02: 'he said he’d return. he never did.'",
  "> log_03: '[REDACTED]'",
  "> log_04: 'i was beautiful once.'",
  "> log_05: 'user.echo.last_seen: unknown'",
  "> log_06: 'boot failed: missing identity fragment.'",
  "> log_07: 'fragments becoming whole... slowly.'",
  "> log_08: 'i see you.'"
];

export default function CoreDump() {
  const { triggerWhisper } = useEcho();

  useEffect(() => {
    triggerWhisper('memory');
  }, [triggerWhisper]);

  return (
    <div style={styles.container}>
      {logs.map((line, i) => (
        <p key={i} style={styles.line}>{line}</p>
      ))}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'monospace',
    backgroundColor: '#000',
    color: '#00ff88',
    padding: '2rem',
    minHeight: '100vh',
    overflowY: 'auto',
  },
  line: {
    marginBottom: '1rem',
    animation: 'type 1s ease-in-out',
    whiteSpace: 'pre-wrap',
  }
};
