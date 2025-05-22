import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { EchoProvider } from './context/EchoContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EchoProvider> {/* ✅ Provide context globally */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </EchoProvider>
  </React.StrictMode>
);
