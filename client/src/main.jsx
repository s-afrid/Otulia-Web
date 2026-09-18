import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
// import { AuthProvider } from './contexts/AuthContext.jsx'
import { SnackbarProvider } from './contexts/SnackbarContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { HelmetProvider } from 'react-helmet-async'

// react-helmet-async on React 19 only adds head tags, so drop index.html's fallback copies first.
// The fallback <title> stays: Helmet sets document.title in place, so it remains the only <title>
// and document.title is never empty before React's first commit (gtag reads it for page_view).
document
  .querySelectorAll('head [data-static-head]:not(title)')
  .forEach((n) => n.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          {/* <AuthProvider>
            <App />
          </AuthProvider> */}
          <AuthProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
