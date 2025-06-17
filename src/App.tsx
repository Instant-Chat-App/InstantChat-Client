import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import { initializeSocket } from './socket/socket-io';


function App() {
   useEffect(() => {
      console.log("Initializing socket...");
      const socket = initializeSocket();

      if (!socket) {
         console.error("Socket initialization failed");
         return;
      }
      console.log("Socket initialized successfully");

      return () => {
         console.log("Disconnecting socket...");
         socket.disconnect();
      };
   }, []);
   return <Outlet />
}

export default App
