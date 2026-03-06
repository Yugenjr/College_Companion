import { Server } from 'socket.io';
import StudyRoomChat from '../models/StudyRoomChat.js';
import { getGroqClient } from '../services/groqService.js';
import { generateAIResponse } from '../utils/geminiClient.js';

let io = null;

/**
 * Initialize Socket.IO server
 */
export const initializeSocketIO = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow all localhost origins in development
        if (!origin || origin.includes('localhost')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Firebase token verification helper
  async function verifySocketToken(token) {
    if (!token) throw new Error('No token provided');
    const { getAuth } = await import('../config/firebaseAdmin.js');
    return await getAuth().verifyIdToken(token);
  }

  io.on('connection', async (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Authenticate on connect (token in handshake query)
    let userAuth = null;
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token) {
      try {
        userAuth = await verifySocketToken(token);
        socket.userId = userAuth.uid;
        socket.userEmail = userAuth.email;
        console.log(`✅ Authenticated socket for user: ${userAuth.uid}`);
      } catch (authError) {
        console.warn('❌ Invalid socket token:', authError.message);
        socket.emit('error', { message: 'Authentication failed' });
        socket.disconnect();
        return;
      }
    } else {
      console.warn('❌ No token provided for socket connection');
      socket.emit('error', { message: 'No authentication token' });
      socket.disconnect();
      return;
    }

    // Join a study room
    socket.on('room:join', async ({ roomId, userId, userName }) => {
      try {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.userId = userId;
        socket.userName = userName;

        console.log(`👤 ${userName} joined room: ${roomId}`);

        // Load chat history
        let chat = await StudyRoomChat.findOne({ roomId });
        if (!chat) {
          chat = new StudyRoomChat({ roomId, messages: [] });
          await chat.save();
        }

        // Send chat history to the joining user
        socket.emit('chat:history', {
          messages: chat.messages || []
        });

        // Notify others in the room
        socket.to(roomId).emit('room:userJoined', {
          userId,
          userName,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('❌ Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // User-specific notification
    socket.on('notification:user', async ({ userId, type, title, body, data, source }) => {
      try {
        // Save notification to DB
        const notification = new Notification({ userId, type, title, body, data, source });
        await notification.save();
        // Emit to user channel
        io.to(`user:${userId}`).emit('notification:receive', notification);
      } catch (error) {
        console.error('❌ Error sending user notification:', error);
      }
    });

    // Group broadcast notification
    socket.on('notification:group', async ({ group, type, title, body, data, source }) => {
      try {
        // Save notification to DB for each user in group (assume group is array of userIds)
        if (Array.isArray(group)) {
          for (const userId of group) {
            const notification = new Notification({ userId, type, title, body, data, group: group.join(','), source });
            await notification.save();
            io.to(`user:${userId}`).emit('notification:receive', notification);
          }
        }
      } catch (error) {
        console.error('❌ Error sending group notification:', error);
      }
    });

    // System-wide notification
    socket.on('notification:system', async ({ type, title, body, data, source }) => {
      try {
        // Emit to all connected clients
        io.emit('notification:receive', { type, title, body, data, source, createdAt: new Date() });
      } catch (error) {
        console.error('❌ Error sending system notification:', error);
      }
    });

    // Join user-specific channel for notifications (token required)
    socket.on('user:subscribe', async ({ token }) => {
      try {
        const auth = await verifySocketToken(token);
        socket.join(`user:${auth.uid}`);
        console.log(`🔔 User ${auth.uid} subscribed to notifications.`);
      } catch (err) {
        socket.emit('error', { message: 'Subscription authentication failed' });
      }
    });

    // Handle chat message from user
    socket.on('chat:send', async ({ roomId, userId, userName, text }) => {
      try {
        if (!text || !text.trim()) {
          return socket.emit('error', { message: 'Message cannot be empty' });
        }

        // Save user message to MongoDB
        const chat = await StudyRoomChat.findOne({ roomId });
        if (!chat) {
          return socket.emit('error', { message: 'Room not found' });
        }

        const userMessage = {
          sender: 'user',
          userId,
          userName,
          text: text.trim(),
          timestamp: new Date()
        };

        chat.messages.push(userMessage);
        await chat.save();

        // Broadcast user message to all room members
        io.to(roomId).emit('chat:message', userMessage);

        console.log(`💬 Message in ${roomId} from ${userName}: ${text.substring(0, 50)}...`);

        // Get AI response
        try {
          console.log('🤖 Calling AI for response...');
          
          // Prepare context from recent messages
          const recentMessages = chat.messages.slice(-10);
          const context = recentMessages
            .map(m => `${m.sender === 'user' ? m.userName : 'Assistant'}: ${m.text}`)
            .join('\n');

          const aiPrompt = `You are a helpful study assistant in a collaborative study room. Multiple students are studying together. Previous conversation:\n${context}\n\nProvide a helpful, concise response to help with their studies. Keep responses friendly and educational.`;

          let aiResponseText;
          try {
            aiResponseText = await generateAIResponse(aiPrompt, { temperature: 0.7, max_tokens: 500 });
          } catch (geminiError) {
            console.warn('⚠️  Gemini failed, using Groq fallback');
            const groqClient = getGroqClient();
            const groqResponse = await groqClient.chat.completions.create({
              model: "llama-3.1-70b-versatile",
              messages: [{ role: "user", content: aiPrompt }],
              temperature: 0.7,
              max_tokens: 500
            });
            aiResponseText = groqResponse.choices[0].message.content;
          }

          // Save AI response to MongoDB
          const aiMessage = {
            sender: 'assistant',
            text: aiResponseText,
            timestamp: new Date()
          };

          chat.messages.push(aiMessage);
          await chat.save();

          // Broadcast AI response to all room members
          io.to(roomId).emit('chat:aiResponse', aiMessage);

          console.log(`🤖 AI responded in ${roomId}`);

        } catch (aiError) {
          console.error('❌ AI response error:', aiError);
          
          // Send fallback message
          const fallbackMessage = {
            sender: 'assistant',
            text: 'Sorry, I\'m having trouble responding right now. Please try again.',
            timestamp: new Date()
          };
          
          io.to(roomId).emit('chat:aiResponse', fallbackMessage);
        }

      } catch (error) {
        console.error('❌ Error handling message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('chat:typing', ({ roomId, userId, userName, isTyping }) => {
      socket.to(roomId).emit('chat:userTyping', {
        userId,
        userName,
        isTyping
      });
    });

    // Leave room
    socket.on('room:leave', ({ roomId, userId, userName }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('room:userLeft', {
        userId,
        userName,
        timestamp: new Date()
      });
      console.log(`👋 ${userName} left room: ${roomId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.roomId && socket.userName) {
        socket.to(socket.roomId).emit('room:userLeft', {
          userId: socket.userId,
          userName: socket.userName,
          timestamp: new Date()
        });
        console.log(`❌ ${socket.userName} disconnected from ${socket.roomId}`);
      }
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  console.log('✅ Socket.IO server initialized');
  return io;
};

/**
 * Get Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocketIO() first.');
  }
  return io;
};

export default { initializeSocketIO, getIO };
