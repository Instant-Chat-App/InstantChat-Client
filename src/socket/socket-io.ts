import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let isInitializing = false;

export function initializeSocket() {
  // Prevent multiple initialization attempts
  if (isInitializing) return socket;
  if (socket?.connected) return socket;

  isInitializing = true;

  try {
    const tokensString = localStorage.getItem("auth_tokens");
    const token = tokensString ? JSON.parse(tokensString).accessToken : null;

    if (!token) {
      console.error("No token found. Socket initialization aborted.");
      isInitializing = false;
      return null;
    }

    socket = io("http://localhost:8080/", {
      autoConnect: true,
      reconnectionAttempts: 5,
      auth: (cb) => {
        cb({ token });
      },
      reconnectionDelay: 1000,
      timeout: 2000,
    });

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
      isInitializing = false;
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      // If the server disconnected us due to token issues, clean up
      if (reason === "io server disconnect") {
        socket?.close();
        socket = null;
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      isInitializing = false;
      // If there's an authentication error, clean up
      if (error.message === "Authentication error") {
        socket?.close();
        socket = null;
      }
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log("Reconnecting attempt:", attempt);
      // Refresh token on reconnection attempts
      const freshTokensString = localStorage.getItem("auth_tokens");
      const freshToken = freshTokensString ? JSON.parse(freshTokensString).accessToken : null;
      if (freshToken && socket) {
        socket.auth = { token: freshToken };
      }
    });

    return socket;
  } catch (error) {
    console.error("Socket initialization error:", error);
    isInitializing = false;
    return null;
  }
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  isInitializing = false;
}
   