import { Outlet } from 'react-router-dom'
import { initializeSocket } from './socket/socket-io'
import { Toaster } from 'sonner'

function App() {
   initializeSocket()
   return (
      <>
         <Outlet />
         <Toaster position='top-center' richColors />
      </>
   )
}

export default App
