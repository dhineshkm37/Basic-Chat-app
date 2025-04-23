const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for messages from the client
  socket.on('send_message', (message) => {
    const timestamp = new Date().toLocaleTimeString(); // Get current time
    const messageWithTimestamp = { ...message, timestamp }; // Add timestamp to message

    console.log('Message received: ', messageWithTimestamp);

    // Broadcast the message with timestamp to all connected clients
    io.emit('receive_message', messageWithTimestamp);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
