import mongoose from 'mongoose';

/**
 * USER-SCOPED DATA MODEL
 * Every user has their own isolated dataset stored in MongoDB
 * All data persists across logout/login sessions
 */

const userSchema = new mongoose.Schema({
  // Firebase UID - unique identifier
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Root Email Field (Best Practice for uniqueness)
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values without conflict
    trim: true,
    lowercase: true
  },

  // User Profile Information
  profile: {
    fullName: { type: String, default: '' },
    email: { type: String }, // Kept for backward compatibility
    photoURL: { type: String, default: '' },
    phone: { type: String, default: '' },
    department: { type: String, default: '' },
    year: { type: String, default: '' },
    collegeName: { type: String, default: '' },
    course: { type: String, default: '' },
    semester: { type: String, default: '' },
    age: { type: Number, default: null },
    updatedAt: { type: Date, default: Date.now }
  },

  // Survival Kit - Essentials, Revision Strategies, Survival Plans
  survivalKit: {
    essentials: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    revisionStrategies: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      topic: { type: String, required: true },
      strategy: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    survivalPlans: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      title: { type: String, required: true },
      plan: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }]
  },

  // Notes Repository
  notesRepository: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    pdfURL: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],

  // Attendance Advisor
  attendanceAdvisor: {
    history: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      date: { type: String, required: true },
      subject: { type: String, required: true },
      present: { type: Number, required: true },
      total: { type: Number, required: true },
      predicted: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now }
    }]
  },

  // Question Generator
  questionGenerator: {
    savedQuestions: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      question: { type: String, required: true },
      answer: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now }
    }]
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;

