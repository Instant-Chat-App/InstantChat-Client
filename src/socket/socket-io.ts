import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initializeSocket() {
  if (!socket) {
    socket = io("http://localhost:8080/", {
      autoConnect: true,
      reconnectionAttempts: 5,
      auth:(func) =>{
        const token = "Bearer "+ localStorage.getItem("accessToken");
        if (token) {
          func({ token });
        } else {
          func({ token: null });
        }
      },
      reconnectionDelay: 1000,
      timeout: 2000,
    })
  }

  socket.on("connection", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log("Reconnecting attempt:", attempt);
  });

  return socket;
}

export function getSocket(){
  return socket;
}
