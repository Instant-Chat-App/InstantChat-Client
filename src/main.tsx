import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './assets/index.css'
import { routes } from './routes/router.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <RouterProvider router={routes} />
      <QueryClientProvider client={queryClient}></QueryClientProvider>
   </StrictMode>
)
