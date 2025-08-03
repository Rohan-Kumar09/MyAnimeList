import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.jsx'
import { AnimeCacheProvider } from './context/AnimeCacheContext.jsx'

createRoot(document.getElementById('root')).render(
  <AnimeCacheProvider>
    <App />
  </AnimeCacheProvider>
)
