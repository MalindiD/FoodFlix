const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env variables
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

// Middleware
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Mount routes
app.use('/api/notifications', require('./routes/notification'));

// Error handler
app.use(errorHandler);

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`📡 Delivery client connected: ${socket.id}`);

  socket.on('joinRoom', (deliveryPartnerId) => {
    socket.join(deliveryPartnerId);
    console.log(`🚚 Partner joined room: ${deliveryPartnerId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Delivery client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Notification service running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Graceful exit
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
