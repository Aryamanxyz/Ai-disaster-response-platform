require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');


// Database connect karo
connectDB();

// HTTP server banao Express ke upar
const httpServer = http.createServer(app);

// Socket.io ko HTTP server se attach karo
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Socket handler ko io pass karo
require('./sockets/socketHandler')(io);

// Server start karo
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server chal raha hai port ${PORT} pe`);
});