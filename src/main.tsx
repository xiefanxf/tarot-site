import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n'
import { TarotDataProvider } from './data/userData'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider><TarotDataProvider><App /></TarotDataProvider></I18nProvider>
  </StrictMode>,
)
