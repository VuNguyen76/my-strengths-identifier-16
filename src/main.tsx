
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Defer non-critical CSS
const loadNonCriticalCSS = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/non-critical.css';
  document.head.appendChild(link);
};

// Create the React root and render the app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
  
  // Load non-critical resources after the app is rendered
  window.addEventListener('load', () => {
    loadNonCriticalCSS();
    
    // Add performance mark for analytics
    if ('performance' in window) {
      window.performance.mark('app-loaded');
    }
  });
}
