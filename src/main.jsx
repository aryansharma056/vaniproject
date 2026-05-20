import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VIPProvider } from './context/VIPContext'
import App from './App'
import './index.css'          // ← Tailwind + custom styles

ReactDOM.createRoot(document.getElementById('root')).render(
 <BrowserRouter basename={import.meta.env.BASE_URL}>
    <VIPProvider>
      <App />
    </VIPProvider>
  </BrowserRouter>
)
