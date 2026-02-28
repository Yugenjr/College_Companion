import User from '../models/User.js';

/**
 * POST /api/users/create
 * Create new user document
 */
export const createUser = async (req, res) => {
  try {
    const { uid, email, name } = req.user;

    // Validation
    if (!uid) {
      return res.status(400).json({
        success: false,
        error: 'UID is required'
      });
    }

    // Check if user already exists (by UID or Email)
    const existingUser = await User.findOne({
      $or: [{ uid }, ...(email ? [{ email }] : [])]
    });

    if (existingUser) {
      return res.json({
        message: 'User already exists',
        user: existingUser
      });
    }

    // Create new user with root-level email
    const newUser = new User({
      _id: uid,
      uid: uid,
      email: email || undefined, // undefined tells Mongo to ignore (sparse index friendly)
      profile: {
        name: name || '',
        try {
        email: email // Keep for backward compatibility
      }
    });

    await newUser.save();

    res.json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      console.error('⚠️ Duplicate Key Error:', error.keyValue);
      return res.status(409).json({
        success: false,
        error: 'User already exists (Duplicate Key)',
        details: error.keyValue
      });
    }

    console.error('❌ Create user error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      code: 500
    });
  }
};

/**
 * GET /api/users/:uid
 * Get user document
 */
export const getUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 404
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Get user error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      code: 500
    });
  }
};

/**
 * PUT /api/users/:uid/updateSection
 * Update a specific section of user data
 * Body: { section: "notes"|"essentials"|..., data: {} }
 */
export const updateSection = async (req, res) => {
  try {
    const { uid } = req.params;
    const { section, data } = req.body;

    const validSections = [
      'profile',
      'settings',
      'savedChats',
      'notes',
      'questionHistory',
      'survivalPlans',
      'essentials',
      'revisionPlans',
      'attendanceQueries'
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        error: `Invalid section. Must be one of: ${validSections.join(', ')}`,
        code: 400
      });
    }

    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 404
      });
    }

    // Handle different section types
    if (Array.isArray(user[section])) {
      // For arrays, push new data
      user[section].push(data);
    } else if (typeof user[section] === 'object') {
      // For objects, merge data
      user[section] = { ...user[section], ...data };
    } else {
      // Direct assignment for primitive types
      user[section] = data;
    }

    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: `Section '${section}' updated successfully`,
      user
    });
  } catch (error) {
    console.error('❌ Update section error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update section',
      code: 500
    });
  }
};

export default {
  createUser,
  getUser,
  updateSection
};
