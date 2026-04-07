import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

const clerkPubKey  = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey ) {
  throw new Error("Está faltando a Chave do Clerk!")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey } afterSignOutUrl="/">      
    <App />
    </ClerkProvider>
  </StrictMode>,
)
