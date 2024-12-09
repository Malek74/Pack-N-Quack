import { io } from 'socket.io-client';

const userId = localStorage.getItem('userId');

// Initialize Socket.IO client
const socket = io('https://dqbw8hmb-8000.uks1.devtunnels.ms/', {
    transports: ['websocket'], // Optional: Specify transport mechanism
    auth: {
        userId: userId, // Send the user ID during connection
    },
});

// Handle connection events
socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});

// Optional: Handle errors
socket.on('connect_error', (err) => {
    console.error('Connection error:', err);
});

export default socket;
