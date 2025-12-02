import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initSentry } from './src/lib/sentry';
import './src/index.css';

initSentry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);