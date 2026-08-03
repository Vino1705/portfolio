import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import ResumePage from './components/ResumePage.jsx';

import './styles/tokens.css';
import './styles/base.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResumePage />
  </StrictMode>
);
