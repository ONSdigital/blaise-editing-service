import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { MemoryRouter } from 'react-router-dom';
import App from './client/App';
import reportWebVitals from './client/reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </React.StrictMode>,
);

reportWebVitals();
