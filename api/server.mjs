import express from 'express';
import mongoose from 'mongoose';
import loadTestRoutes from './routes/loadTestRoutes.mjs';
import dotenv from 'dotenv';
import {WebSocketServer } from 'ws'; // Import WebSocket


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/load-test', loadTestRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:Bot2do$2024@bot2do.cztoevt.mongodb.net/imdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});



// Create a WebSocket server
const wss = new WebSocketServer({server: app});
// WebSocket server connection handling
wss.on('connection', function connection(ws) {
    console.log('WebSocket client connected');

    // WebSocket message handling
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    // WebSocket connection closure handling
    ws.on('close', function close() {
        console.log('WebSocket client disconnected');
    });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
