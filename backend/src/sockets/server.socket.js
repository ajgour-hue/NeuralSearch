import {Server } from 'socket.io';
let io;

export function initSocket(httpServer) {
    // io = new Server(httpServer, {
    //     cors: {
    //         origin: 'http://localhost:5173',
    //         credentials: true
    //     }
    // }); 

    io = new Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://neuralsearch.vercel.app",
        ],
        credentials: true
    }
});

    console.log("Socket io server is running ");
    

    io.on('connection', (socket) => {
         console.log('a user connected with id: ' + socket.id  );
    });
}   

export function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}