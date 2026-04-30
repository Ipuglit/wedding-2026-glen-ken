import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ProTheme } from './_theme/provider-theme.jsx';
import { ProLoader } from '@/_components/loader/pro-loader';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProTheme>
      <ProLoader />
      <App />
    </ProTheme>
  </StrictMode>,
);
