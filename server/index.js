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
    origin: ["http://localhost:3000", "https://real-time-chat-app-1-ctof.onrender.com"],
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
        origin: ["http://localhost:3000", "https://real-time-chat-app-1-ctof.onrender.com"],
        methods: ['GET', 'POST'],
        credentials: true  // Allow credentials (cookies, auth headers)
    }
});


// Socket.io event handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', ({ username, room }) => {
        if (!room) return; //  Prevent errors if no room is provided
        socket.join(room);
        console.log(`${username} joined room: ${room}`);

        // Notify others in the room
        socket.to(room).emit('userJoined', username, room);
    });



    // Handle leave a room
    socket.on("leaveRoom", ({ username, room }) => {
        if (!room) return;
        socket.leave(room);
        console.log(`${username} left room: ${room}`);

        socket.to(room).emit("userLeft", { username, room });
    });


    // Typing event handler
    socket.on('typing', ({ username, room }) => {
        socket.to(room).emit('userTyping', username); // Broadcast typing event
    })

    // Stop typing event handler
    socket.on('stopTyping', ({ room }) => {
        socket.to(room).emit('userStopTyping'); // Broadcast stop typing event
    })



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

app.get('/api/test', (req, res) => {
    res.json({ message: "API is working!" });
});




// Define the port and start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})