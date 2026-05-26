import { Server, Socket } from 'socket.io';
import prisma from '../config/db';
import jwt from 'jsonwebtoken';

// Authenticate socket connections
export const setupSockets = (io: Server) => {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const secret = process.env.JWT_SECRET || 'fallback_secret';
      const decoded = jwt.verify(token, secret) as any;
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.id}`);
    
    // Join a room specifically for this user to receive direct messages
    socket.join(`user_${user.id}`);

    // Listen for direct messages
    socket.on('send_message', async (data) => {
      const { receiverId, content } = data;
      
      try {
        // Save message to database
        const message = await prisma.message.create({
          data: {
            sender_id: user.id,
            receiver_id: receiverId,
            content
          }
        });

        // Emit to the receiver's room
        io.to(`user_${receiverId}`).emit('receive_message', message);
        // Also emit back to the sender so they can update their UI
        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Error saving message', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.id}`);
    });
  });
};
