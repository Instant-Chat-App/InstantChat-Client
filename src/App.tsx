import { Outlet } from 'react-router-dom'
import { initializeSocket } from './socket/socket-io'


function App() {
   initializeSocket()
   return <Outlet />
}

export default App
