import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import cors from 'cors';
import { displaySelfXSSWarning } from './utils/security';

// Initialize security protections
displaySelfXSSWarning();

const allowedOrigins = [
    'http://localhost:3000',      // Local dev
    'http://localhost:5173',      // Vite dev
    'https://soma-frontend.vercel.app',      // Production frontend
    'https://www.soma-frontend.vercel.app'   // With www
];


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
