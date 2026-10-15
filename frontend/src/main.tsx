import '@fontsource-variable/inter';
import { injectSelfXSSWarning } from './security/consoleWarning';
injectSelfXSSWarning();

import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from '../App';
import '../index.css';
import { ThemeProvider } from '../context/ThemeContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ThemeProvider>
  </React.StrictMode>
);
