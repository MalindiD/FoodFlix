const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const partnerRoutes = require('./routes/partnerRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const locationRoutes = require('./routes/location-routes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);
connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api/partners', partnerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/location', locationRoutes);

app.get('/', (req, res) => {
  res.send('Delivery Service API is running');
});

io.on('connection', (socket) => {
  console.log('Delivery client connected:', socket.id);

  socket.on('joinRoom', (partnerId) => {
    socket.join(partnerId);
    console.log(`Partner joined room: ${partnerId}`);
  });

  socket.on('locationUpdate', (data) => {
    console.log('Location update:', data);
    io.emit('locationUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log(' Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(` Delivery Service running with Socket.IO on port ${PORT}`);
});
