import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProfilePanel } from './ProfilePanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import '../styles/globals.css';

ReactDOM.createRoot(document.getElementById('panel-root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ProfilePanel />
    </ErrorBoundary>
  </React.StrictMode>
);
