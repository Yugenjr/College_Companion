import express from 'express';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/profile/setup
 * Create initial user profile after Firebase registration
 * Called during user onboarding
 */
router.post('/setup', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { name, fullName, phone, department, year, collegeName, degree, age } = req.body;

    console.log('📝 Profile setup request for UID:', uid);
    console.log('📝 Request data:', { name, fullName, email, phone, department, year, collegeName, degree, age });

    // Use findOneAndUpdate with upsert and $setOnInsert to avoid race conditions
    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          'profile.fullName': fullName || name,
          'profile.email': email,
          'profile.phone': phone,
          'profile.department': department,
          'profile.year': year,
          'profile.collegeName': collegeName,
          'profile.course': degree,
          'profile.age': age,
          'profile.updatedAt': new Date()
        },
        $setOnInsert: {
          uid,
          profile: {
            fullName: fullName || name || '',
            email: email || '',
            phone: phone || '',
            department: department || '',
            year: year || '',
            collegeName: collegeName || '',
            course: degree || '',
            age: age || null,
            photoURL: '',
            semester: '',
            updatedAt: new Date()
          }
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    console.log('✅ User profile created or updated:', uid);

    res.json({
      success: true,
      message: 'Profile created or updated successfully',
      profile: user.profile,
      isNewUser: false // Upsert always returns the doc, so isNewUser is false
    });

  } catch (error) {
    console.error('❌ Profile setup error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Profile already exists',
        message: 'A profile with this UID already exists in the database',
        details: error.message
      });
    }

    // MongoDB validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid profile data provided',
        details: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      error: 'Failed to create profile',
      message: error.message,
      details: 'Check server logs for more information'
    });
  }
});

/**
 * GET /api/profile
 * Get current user's profile
 */
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    let user = await User.findOne({ uid });

    // Auto-create user if doesn't exist
    if (!user) {
      user = new User({
        uid,
        email: req.user.email || undefined,
        profile: {
          email: req.user.email,
          fullName: '',
          photoURL: '',
          course: '',
          semester: ''
        }
      });
      await user.save();
    }

    res.json({
      success: true,
      profile: user.profile
    });
  } catch (error) {
    console.error('❌ Get profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
});

/**
 * GET /api/profile/me
 * Get current user's profile (alias for /)
 */
router.get('/me', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    let user = await User.findOne({ uid });

    // Auto-create user if doesn't exist
    if (!user) {
      user = new User({
        uid,
        email: req.user.email || undefined,
        profile: {
          email: req.user.email,
          fullName: '',
          photoURL: '',
          course: '',
          semester: ''
        }
      });
      await user.save();
    }

    res.json({
      success: true,
      profile: user.profile
    });
  } catch (error) {
    console.error('❌ Get profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
});

/**
 * PUT /api/profile/update
 * Update current user's profile
 */
router.put('/update', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { fullName, photoURL, course, semester } = req.body;

    let user = await User.findOne({ uid });

    // Auto-create user if doesn't exist
    if (!user) {
      user = new User({
        uid,
        profile: {
          email: req.user.email,
          fullName: fullName || '',
          photoURL: photoURL || '',
          course: course || '',
          semester: semester || ''
        }
      });
    } else {
      // Update profile fields
      if (fullName !== undefined) user.profile.fullName = fullName;
      if (photoURL !== undefined) user.profile.photoURL = photoURL;
      if (course !== undefined) user.profile.course = course;
      if (semester !== undefined) user.profile.semester = semester;
      user.profile.updatedAt = new Date();
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: user.profile
    });
  } catch (error) {
    console.error('❌ Update profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

/**
 * GET /api/profile/full
 * Get full user data including all sections
 */
router.get('/full', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    let user = await User.findOne({ uid });

    // Auto-create user if doesn't exist
    if (!user) {
      user = new User({
        uid,
        profile: {
          email: req.user.email
        }
      });
      await user.save();
    }

    res.json({
      success: true,
      user: {
        profile: user.profile,
        survivalKit: user.survivalKit,
        notesRepository: user.notesRepository,
        attendanceAdvisor: user.attendanceAdvisor,
        questionGenerator: user.questionGenerator
      }
    });
  } catch (error) {
    console.error('❌ Get full user data error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user data',
      message: error.message
    });
  }
});

export default router;
