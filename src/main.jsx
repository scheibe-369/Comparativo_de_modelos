import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'

// Inject purple scrollbar styles at runtime (bypasses Tailwind CSS layers)
const scrollbarStyle = document.createElement('style');
scrollbarStyle.textContent = `
  /* Global Scrollbar (The "Side Bar") */
  ::-webkit-scrollbar { 
    width: 6px !important; 
    height: 6px !important; 
    background: transparent !important;
  }
  
  ::-webkit-scrollbar-track { 
    background: transparent !important; 
  }
  
  ::-webkit-scrollbar-thumb { 
    background: rgba(123, 97, 255, 0.4) !important; 
    border-radius: 10px !important;
    border: 1px solid transparent !important;
    background-clip: content-box !important;
    transition: all 0.3s ease !important;
  }

  /* Increase size and glow on hover */
  ::-webkit-scrollbar:hover {
    width: 10px !important;
  }
  
  ::-webkit-scrollbar-thumb:hover { 
    background: rgba(123, 97, 255, 0.8) !important; 
    box-shadow: 0 0 15px 2px rgba(123, 97, 255, 0.4) !important;
  }

  /* Firefox Support */
  * { 
    scrollbar-width: thin !important; 
    scrollbar-color: rgba(123, 97, 255, 0.4) transparent !important; 
  }
`;
document.head.appendChild(scrollbarStyle);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
