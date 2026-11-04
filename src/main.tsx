import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx' // 🛡️ Importação

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary> {/* 🛡️ Escudo Ativado */}
      <App />
    </ErrorBoundary>
  </StrictMode>,
)