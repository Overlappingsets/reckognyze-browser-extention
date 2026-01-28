import React from 'react';
import ReactDOM from 'react-dom/client';
import { Popup } from './Popup';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import '../styles/globals.css';

ReactDOM.createRoot(document.getElementById('popup-root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Popup />
    </ErrorBoundary>
  </React.StrictMode>
);
