import React from 'react';
import ReactDOM from 'react-dom/client';
import ElegantApp from './ElegantApp';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount SurakshaNet to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ElegantApp />
  </React.StrictMode>
);