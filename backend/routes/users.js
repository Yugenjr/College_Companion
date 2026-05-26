import express from 'express';
import User from '../models/User.js';
import { getAuth, getDb } from '../services/firebase/index.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/users/:uid - Get user details from Firebase, Firestore, and MongoDB
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const auth = getAuth();
    const db = getDb();

    const [firebaseUser, firestoreDoc, mongoUser] = await Promise.all([
      auth.getUser(uid).catch(() => null),
      db.collection('users').doc(uid).get().catch(() => null),
      User.findOne({ firebaseUID: uid }).lean().catch(() => null)
    ]);

    let mongoDocument = mongoUser;

    if (!mongoDocument) {
      mongoDocument = await User.findOne({ uid }).lean().catch(() => null);
    }

    if (!firebaseUser && !mongoDocument && !firestoreDoc?.exists) {
      return res.json({
        success: false,
        error: 'User not found',
        uid
      });
    }

    const firestoreData = firestoreDoc?.exists ? firestoreDoc.data() : null;

    const response = {
      uid: firebaseUser?.uid || mongoDocument?.firebaseUID || uid,
      email: firebaseUser?.email || mongoDocument?.email || firestoreData?.email || null,
      name: firebaseUser?.displayName || mongoDocument?.name || firestoreData?.name || null,
      photoURL: firebaseUser?.photoURL || mongoDocument?.photoURL || firestoreData?.photoURL || null,
      phoneNumber: firebaseUser?.phoneNumber || firestoreData?.phoneNumber || null,
      customClaims: firebaseUser?.customClaims || null,
      metadata: firebaseUser
        ? {
            creationTime: firebaseUser.metadata.creationTime,
            lastSignInTime: firebaseUser.metadata.lastSignInTime
          }
        : null,
      firestore: firestoreData,
      mongo: mongoDocument
        ? {
            id: mongoDocument._id,
            email: mongoDocument.email,
            name: mongoDocument.name,
            firebaseUID: mongoDocument.firebaseUID,
            photoURL: mongoDocument.photoURL,
            createdAt: mongoDocument.createdAt,
            updatedAt: mongoDocument.updatedAt,
            onboardingCompleted: mongoDocument.onboardingCompleted || false,
            onboardingData: mongoDocument.onboardingData || null
          }
        : null
    };

    res.json({
      success: true,
      user: response
    });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.json({
      success: false,
      error: 'Failed to fetch user data',
      details: error.message
    });
  }
});

// POST /api/users - Create or update user
router.post('/', async (req, res) => {
  try {
    const { email, name, firebaseUID, photoURL } = req.body;
    
    if (!email || !name || !firebaseUID) {
      return res.status(400).json({
        success: false,
        error: 'Email, name, and firebaseUID are required'
      });
    }
    
    // Check if user already exists
    let user = await User.findOne({ firebaseUID });
    
    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      if (photoURL) user.photoURL = photoURL;
      user.updatedAt = new Date();
      await user.save();
      
      console.log('✅ User updated:', email);
    } else {
      // Create new user
      user = new User({
        email,
        name,
        firebaseUID,
        photoURL
      });
      await user.save();
      
      console.log('✅ New user created:', email);
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firebaseUID: user.firebaseUID,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating/updating user:', error);
    res.json({
      success: false,
      error: 'Failed to create/update user',
      details: error.message
    });
  }
});

// POST /api/users/:id/onboarding - Save onboarding data
router.post('/:id/onboarding', async (req, res) => {
  try {
    const { id } = req.params;
    const onboardingData = req.body;
    
    let user;
    
    // Try to find by Firebase UID first
    user = await User.findOne({ firebaseUID: id });
    
    // If not found, try MongoDB ObjectId
    if (!user) {
      user = await User.findOne({ uid: id });
    }
    
    if (!user) {
      return res.json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update user with onboarding data
    user.onboardingData = onboardingData;
    user.onboardingCompleted = true;
    user.updatedAt = new Date();
    await user.save();
    
    console.log('✅ Onboarding data saved for:', user.email);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firebaseUID: user.firebaseUID,
        photoURL: user.photoURL,
        onboardingCompleted: user.onboardingCompleted,
        onboardingData: user.onboardingData,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error saving onboarding data:', error);
    res.json({
      success: false,
      error: 'Failed to save onboarding data',
      details: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user by Firebase UID or MongoDB ID
router.delete('/:id', verifyFirebaseToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    let user;
    
    // Try to find and delete by Firebase UID first
    user = await User.findOneAndDelete({ firebaseUID: id });
    
    // If not found, try MongoDB ObjectId
    if (!user) {
      user = await User.findOneAndDelete({ uid: id });
    }
    
    if (!user) {
      return res.json({
        success: false,
        error: 'User not found'
      });
    }
    
    console.log('✅ User deleted:', user.email);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    });
  }
});

// ==================== SECTION-SPECIFIC ENDPOINTS ====================

// PUT /api/users/:uid/personalDetails - Update personal details
router.put('/:uid/personalDetails', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.personalDetails = { ...user.personalDetails, ...req.body };
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      personalDetails: user.personalDetails
    });
  } catch (error) {
    console.error('❌ Error updating personal details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update personal details',
      details: error.message
    });
  }
});

// PUT /api/users/:uid/settings - Update user settings
router.put('/:uid/settings', verifyFirebaseToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.settings = { ...user.settings, ...req.body };
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      settings: user.settings
    });
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings',
      details: error.message
    });
  }
});

// POST /api/users/:uid/attendanceHistory - Add attendance history entry
router.post('/:uid/attendanceHistory', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.attendanceAdvisorHistory.push({
      ...req.body,
      timestamp: new Date()
    });
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      attendanceHistory: user.attendanceAdvisorHistory
    });
  } catch (error) {
    console.error('❌ Error adding attendance history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add attendance history',
      details: error.message
    });
  }
});

// GET /api/users/:uid/attendanceHistory - Get attendance history
router.get('/:uid/attendanceHistory', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      attendanceHistory: user.attendanceAdvisorHistory || []
    });
  } catch (error) {
    console.error('❌ Error fetching attendance history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance history',
      details: error.message
    });
  }
});

// POST /api/users/:uid/essentialsHistory - Add essentials extractor entry
router.post('/:uid/essentialsHistory', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.essentialsExtractorHistory.push({
      ...req.body,
      timestamp: new Date()
    });
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      essentialsHistory: user.essentialsExtractorHistory
    });
  } catch (error) {
    console.error('❌ Error adding essentials history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add essentials history',
      details: error.message
    });
  }
});

// POST /api/users/:uid/revisionStrategy - Add revision strategy
router.post('/:uid/revisionStrategy', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.revisionStrategy.push({
      ...req.body,
      timestamp: new Date()
    });
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      revisionStrategy: user.revisionStrategy
    });
  } catch (error) {
    console.error('❌ Error adding revision strategy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add revision strategy',
      details: error.message
    });
  }
});

// POST /api/users/:uid/questionHistory - Add question generator entry
router.post('/:uid/questionHistory', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.questionGeneratorHistory.push({
      ...req.body,
      timestamp: new Date()
    });
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      questionHistory: user.questionGeneratorHistory
    });
  } catch (error) {
    console.error('❌ Error adding question history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add question history',
      details: error.message
    });
  }
});

// GET /api/users/:uid/questionHistory - Get question history
router.get('/:uid/questionHistory', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      questionHistory: user.questionGeneratorHistory || []
    });
  } catch (error) {
    console.error('❌ Error fetching question history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch question history',
      details: error.message
    });
  }
});

// POST /api/users/:uid/notes - Add note to repository
router.post('/:uid/notes', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.notesRepository.push({
      ...req.body,
      timestamp: new Date()
    });
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      notesRepository: user.notesRepository
    });
  } catch (error) {
    console.error('❌ Error adding note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add note',
      details: error.message
    });
  }
});

// GET /api/users/:uid/notes - Get all notes
router.get('/:uid/notes', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      notes: user.notesRepository || []
    });
  } catch (error) {
    console.error('❌ Error fetching notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes',
      details: error.message
    });
  }
});

// PUT /api/users/:uid/semesterTools - Update semester tools
router.put('/:uid/semesterTools', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.semesterTools = { ...user.semesterTools, ...req.body };
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      semesterTools: user.semesterTools
    });
  } catch (error) {
    console.error('❌ Error updating semester tools:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update semester tools',
      details: error.message
    });
  }
});

// GET /api/users/:uid/semesterTools - Get semester tools
router.get('/:uid/semesterTools', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      semesterTools: user.semesterTools || { survivalPlans: [], timetables: [], deadlines: [] }
    });
  } catch (error) {
    console.error('❌ Error fetching semester tools:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch semester tools',
      details: error.message
    });
  }
});

// POST /api/users/:uid/saveChat - Save chat to history
router.post('/:uid/saveChat', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.savedChats.push({
      ...req.body,
      timestamp: new Date()
    });
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      savedChats: user.savedChats
    });
  } catch (error) {
    console.error('❌ Error saving chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save chat',
      details: error.message
    });
  }
});

// GET /api/users/:uid/savedChats - Get all saved chats
router.get('/:uid/savedChats', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      savedChats: user.savedChats || []
    });
  } catch (error) {
    console.error('❌ Error fetching saved chats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch saved chats',
      details: error.message
    });
  }
});

// POST /api/users/:uid/doubtHistory - Add doubt solver entry
router.post('/:uid/doubtHistory', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.doubtSolverHistory.push({
      ...req.body,
      timestamp: new Date()
    });
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      doubtHistory: user.doubtSolverHistory
    });
  } catch (error) {
    console.error('❌ Error adding doubt history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add doubt history',
      details: error.message
    });
  }
});

export default router;
