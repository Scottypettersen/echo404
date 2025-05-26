// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { EchoProvider } from './context/EchoContext';
import './firebase'; // ← initializes auth + Firestore

const rootEl = document.getElementById('root');

ReactDOM
  .createRoot(rootEl)
  .render(
    <React.StrictMode>
      <EchoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </EchoProvider>
    </React.StrictMode>
  );
