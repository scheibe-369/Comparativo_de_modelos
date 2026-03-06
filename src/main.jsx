import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
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
    background: rgba(0, 0, 0, 0.2) !important; 
  }
  
  ::-webkit-scrollbar-thumb { 
    background: #7B61FF !important; 
    border-radius: 10px !important;
    border: 2px solid transparent !important;
    background-clip: content-box !important;
    transition: all 0.3s ease !important;
  }

  /* Increase size and glow on hover */
  ::-webkit-scrollbar:hover {
    width: 12px !important;
  }
  
  ::-webkit-scrollbar-thumb:hover { 
    background: #9B8AFF !important; 
    background-clip: padding-box !important;
    box-shadow: 0 0 20px 5px rgba(123, 97, 255, 0.8) !important;
    border: 0px solid transparent !important;
  }

  /* Firefox Support */
  * { 
    scrollbar-width: thin !important; 
    scrollbar-color: #7B61FF transparent !important; 
  }
`;
document.head.appendChild(scrollbarStyle);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
