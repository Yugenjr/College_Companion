import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { initializeFirebaseAdmin } from './config/firebaseAdmin.js';
import { initializeGroqClient } from './services/groqService.js';
import { initializeGeminiClient } from './utils/geminiClient.js';
import { initializeSocketIO } from './config/socket.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { saveMessage } from './services/chatService.js';

// Import NEW user-scoped routes
import profileRoutes from './routes/profileRoutes.js';
import survivalRoutes from './routes/survivalRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import questionsRoutes from './routes/questionsRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import auctionRoutes from './routes/auction.js';
import chatRoutes from './routes/chat.js';

// Import legacy routes (kept for backwards compatibility)
import apiRoutes from './routes/apiRoutes.js';
import aiAttendanceRoutes from './routes/aiAttendance.js';

// Import study room chat routes
import studyRoomChatRoutes from './routes/studyRoomChatRoutes.js';

// Import authentication and protected routes
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize services
console.log('🚀 Initializing Backend Services...\n');

try {
  // Initialize MongoDB
  try {
    await connectDB();
    console.log('');
  } catch (dbError) {
    console.error('❌ MongoDB connection failed:', dbError.message);
    console.warn('⚠️  Continuing without MongoDB. Database features will not work.');
  }

  // Initialize Firebase Admin SDK
  try {
    initializeFirebaseAdmin();
    console.log('');
  } catch (firebaseError) {
    console.error('❌ Firebase initialization failed:', firebaseError.message);
    console.warn('⚠️  Continuing without Firebase. Auth features will not work.');
  }

  // Initialize Gemini AI (primary AI provider)
  try {
    initializeGeminiClient();
    console.log('');
  } catch (geminiError) {
    console.warn('⚠️  Gemini initialization failed:', geminiError.message);
    console.warn('⚠️  Will use Groq as fallback for all AI operations.');
  }

  // Initialize Groq API (fallback AI provider)
  initializeGroqClient();
  console.log('');
} catch (error) {
  console.error('❌ Critical service initialization failed:', error.message);
  console.warn('⚠️  Some features may not work properly.');
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting middleware
import { apiRateLimiter } from './middleware/rateLimiter.js';
app.use(apiRateLimiter);

// CORS Configuration - Allow all localhost origins for development
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://mernproj1.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin
    if (!origin) return callback(null, true);

    // In development, allow all localhost origins
    if (process.env.NODE_ENV !== 'production' && origin && origin.includes('localhost')) {
      return callback(null, true);
    }

    // Allow all Vercel deployments (preview & production)
    if (origin && origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve uploaded files (avatars, essentials, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'connected',
      groq: 'initialized',
      firebase: 'initialized',
    },
  });
});

// NEW USER-SCOPED API ROUTES (All require Firebase authentication)
app.use('/api/profile', profileRoutes);
app.use('/api/survival', survivalRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/study-room-chat', studyRoomChatRoutes);
app.use('/api/auction', auctionRoutes);
app.use('/api/chat', chatRoutes);

// Legacy routes (kept for backwards compatibility)
app.use('/api', apiRoutes);
app.use('/api/ai-attendance', aiAttendanceRoutes);

// Authentication and protected routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// Catch-all Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    availableEndpoints: {
      profile: [
        'GET /api/profile - Get user profile',
        'PUT /api/profile/update - Update profile',
        'GET /api/profile/full - Get full user data'
      ],
      survivalKit: [
        'POST /api/survival/essentials - Add essential',
        'GET /api/survival/essentials - Get all essentials',
        'DELETE /api/survival/essentials/:id - Delete essential',
        'POST /api/survival/revision-strategies - Add revision strategy',
        'GET /api/survival/revision-strategies - Get all strategies',
        'POST /api/survival/plans - Add survival plan',
        'GET /api/survival/plans - Get all plans',
        'DELETE /api/survival/plans/:id - Delete plan'
      ],
      notes: [
        'POST /api/notes - Add note',
        'GET /api/notes - Get all notes',
        'GET /api/notes/:id - Get specific note',
        'PUT /api/notes/:id - Update note',
        'DELETE /api/notes/:id - Delete note'
      ],
      questions: [
        'POST /api/questions - Save question',
        'GET /api/questions - Get all questions',
        'DELETE /api/questions/:id - Delete question'
      ],
      attendance: [
        'POST /api/attendance - Add attendance record',
        'GET /api/attendance - Get all records',
        'GET /api/attendance/stats - Get statistics',
        'DELETE /api/attendance/:id - Delete record'
      ]
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  console.error(err.stack);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation',
      message: 'Origin not allowed',
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: 'File upload error',
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
  });
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
try {
  initializeSocketIO(httpServer);
  console.log('🔌 WebSocket server ready for Study Arena\n');
} catch (socketError) {
  console.error('❌ Socket.IO initialization failed:', socketError.message);
  console.warn('⚠️  Study Arena chat will not work.\n');
}

// Start HTTP & Socket.io server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
