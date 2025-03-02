const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

// Import the DB connection function
const connectDB = require('./config/db');

// Initialize the express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON data and handling CORS
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


// Import and use authentication routes
app.use('/api/auth', require('./routes/authRoutes'));

// Create an HTTP server for integrating Socket.io
const server = http.createServer(app);

// Setup Socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Socket.io event handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('sendMessage', (msgData) => {
        // Add timestamp before broadcasting the message
        const messageWithTimestamp = {
            ...msgData,
            timestamp: new Date().toISOString()  // Add timestamp
        };
        // Broadcast the message to everyone in the room
        io.to(msgData.to).emit('receiveMessage', messageWithTimestamp);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


app.get('/', (req, res) => {
    res.send('Welcome to the Real-Time Chat App API!');
});



// Define the port and start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})