const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Uses the new URL parser to handle MongoDB connection strings
            useUnifiedTopology: true // Uses the new Server Discover and Monitoring engine
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit the process with failure if connection fails
    }
};

module.exports = connectDB;