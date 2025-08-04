import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.jsx'
import { AnimeCacheProvider } from './context/AnimeCacheContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AnimeCacheProvider>
        <App />
      </AnimeCacheProvider>
    </AuthProvider>
  </StrictMode>
)
