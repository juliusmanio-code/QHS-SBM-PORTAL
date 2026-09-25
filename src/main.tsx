import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import './index.css';

// Prevent silent unhandled promise rejections from crashing the whole app view
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection captured gracefully:', event.reason);
  // Prevent default error bubbling if it has a reason or message
  if (event.reason) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

