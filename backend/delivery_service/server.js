const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const partnerRoutes = require('./routes/partnerRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http'); // ✅ For wrapping app
const { Server } = require('socket.io'); // ✅ Socket.IO

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Use HTTP server wrapper
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // your frontend
    methods: ['GET', 'POST']
  }
});

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/partners', partnerRoutes);
app.use('/api/delivery', deliveryRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Delivery Service API is running');
});

// ✅ WebSocket logic
io.on("connection", (socket) => {
  console.log("Delivery client connected:", socket.id);

  socket.on("locationUpdate", (data) => {
    io.emit("locationUpdate", data); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ✅ Start HTTP server (not app.listen)
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Delivery Service running with Socket.IO on port ${PORT}`);
});
