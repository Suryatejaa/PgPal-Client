// src/services/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

console.log('🔌 WebSocket connecting to:', SOCKET_URL);

let socket: Socket | null = null;


export function getSocket(): Socket {
  if (!socket) {

    if (!SOCKET_URL) {
      console.error('⛔ Missing WebSocket URL! Check your environment variables.');
      throw new Error('Missing WebSocket URL configuration');
    }

    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      secure: !window.location.hostname.includes('localhost'),
      rejectUnauthorized: !window.location.hostname.includes('localhost'),
      timeout: 20000,
      forceNew: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from WebSocket server:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected to WebSocket server, attempt:', attemptNumber);
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    console.log('🔌 Disconnecting WebSocket');
    socket.disconnect();
    socket = null;
  }
}