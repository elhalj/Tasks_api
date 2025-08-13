import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { TaskProvider } from './context/TaskProvider'
import { RoomProvider } from './context/RoomProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RoomProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </RoomProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
