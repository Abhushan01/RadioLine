// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';
import { AudioProvider } from './context/AudioPlayer';
import { registerSW } from './sw-registration';

registerSW();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <HashRouter>
    <AudioProvider>
      <App />
    </AudioProvider>
  </HashRouter>
  // {/* </StrictMode> */}
);
