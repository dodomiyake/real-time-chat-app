const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const User = require("./models/User");
const path = require("path");

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

// Serve static files from the React app
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import and use authentication routes
app.use('/api/auth', require('./routes/authRoutes'));

// Import and use user routes
app.use('/api/users', require('./routes/userRoutes'));

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

    socket.on('sendMessage', async (msgData) => { // Make function async
        try {
            //  Fetch user from DB
            const user = await User.findOne({ username: msgData.from });

            //  Ensure valid avatar URL
            const avatarUrl = user && user.avatar ? user.avatar : "https://i.pravatar.cc/150?u=default";

            const messageWithAvatar = {
                ...msgData,
                timestamp: new Date().toISOString(),
                avatar: avatarUrl
            };

            // Broadcast the message with avatar
            io.to(msgData.to).emit('receiveMessage', messageWithAvatar);
        } catch (error) {
            console.error("Error sending message:", error);
        }
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