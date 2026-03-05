// Frontend Chat Service (Socket.io)
import { io } from 'socket.io-client';

let socket;

export function connectChat({ token, roomId, username }) {
  socket = io('/', {
    query: { token, roomId, username },
    transports: ['websocket'],
  });
}

export function sendMessage(message) {
  if (socket) socket.emit('chatMessage', message);
}

export function sendPrivateMessage(to, message) {
  if (socket) socket.emit('privateMessage', { to, message });
}

export function onMessage(callback) {
  if (socket) socket.on('chatMessage', callback);
}

export function onPrivateMessage(callback) {
  if (socket) socket.on('privateMessage', callback);
}

export function onUserList(callback) {
  if (socket) socket.on('userList', callback);
}

export function onUserJoined(callback) {
  if (socket) socket.on('userJoined', callback);
}

export function onUserLeft(callback) {
  if (socket) socket.on('userLeft', callback);
}

export function onError(callback) {
  if (socket) socket.on('errorMessage', callback);
}

export function disconnectChat() {
  if (socket) socket.disconnect();
}
