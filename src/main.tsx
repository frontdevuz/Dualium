import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-ext-400.css';
import '@fontsource/manrope/latin-ext-500.css';
import '@fontsource/manrope/latin-ext-600.css';
import '@fontsource/manrope/latin-ext-700.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-ext-400.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/cormorant-garamond/latin-ext-600.css';
import '@fontsource/cormorant-garamond/latin-ext-700.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './i18n';
import './index.css';
import './styles/markdown.css';
import App from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
