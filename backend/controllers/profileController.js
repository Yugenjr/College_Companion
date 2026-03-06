import UserProfile from '../models/UserProfile.js';
import { getAuth } from '../config/firebaseAdmin.js';

/**
 * Get or create user profile
 * Auto-creates profile if it doesn't exist
 * @route GET /api/profile/me
 */
export const getMyProfile = async (req, res) => {
  try {
    const { uid, email } = req.user;

    // Use findOneAndUpdate with upsert and $setOnInsert to avoid race conditions
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $setOnInsert: {
          firebaseUid: uid,
          email: email || '',
          name: '',
          phone: '',
          department: '',
          year: '',
          section: '',
          registerNumber: '',
          semester: 1,
          subjects: [],
          settings: {
            darkMode: false,
            notifications: {
              essentialAlerts: true,
              studyReminders: true,
              timetableChanges: true,
            },
            language: 'en',
          },
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      profile: profile.toSafeObject(),
    });
  } catch (error) {
    console.error('Error in getMyProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message,
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/profile/update
 */
export const updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const updateData = req.body;

    // Fields that can be updated
    const allowedFields = [
      'name',
      'phone',
      'department',
      'year',
      'section',
      'registerNumber',
      'semester',
      'subjects',
    ];

    // Filter update data to only allowed fields
    const filteredUpdate = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredUpdate[field] = updateData[field];
      }
    });

    if (Object.keys(filteredUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    // Update profile
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: uid },
      filteredUpdate,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: profile.toSafeObject(),
    });

    // Trigger notification via Socket.IO (if available)
    try {
      const { getIO } = await import('../config/socket.js');
      const io = getIO();
      io.to(`user:${uid}`).emit('notification:receive', {
        type: 'profile',
        title: 'Profile Updated',
        body: 'Your profile has been updated successfully.',
        data: profile.toSafeObject(),
        source: 'profile',
        createdAt: new Date()
      });
    } catch (notifyError) {
      console.warn('⚠️  Could not send profile notification:', notifyError.message);
    }
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

/**
 * Update user settings
 * @route PUT /api/profile/settings
 */
export const updateSettings = async (req, res) => {
  try {
    const { uid } = req.user;
    const { darkMode, notifications, language } = req.body;

    const updateData = {};

    if (darkMode !== undefined) {
      updateData['settings.darkMode'] = darkMode;
    }
    if (notifications !== undefined) {
      if (notifications.essentialAlerts !== undefined) {
        updateData['settings.notifications.essentialAlerts'] = notifications.essentialAlerts;
      }
      if (notifications.studyReminders !== undefined) {
        updateData['settings.notifications.studyReminders'] = notifications.studyReminders;
      }
      if (notifications.timetableChanges !== undefined) {
        updateData['settings.notifications.timetableChanges'] = notifications.timetableChanges;
      }
    }
    if (language !== undefined) {
      const validLanguages = ['en', 'es', 'fr', 'de', 'hi', 'ta'];
      if (!validLanguages.includes(language)) {
        return res.status(400).json({
          success: false,
          message: `Invalid language. Allowed: ${validLanguages.join(', ')}`,
        });
      }
      updateData['settings.language'] = language;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid settings provided for update',
      });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: uid },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: profile.settings,
    });
  } catch (error) {
    console.error('Error in updateSettings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message,
    });
  }
};

/**
 * Upload user avatar
 * @route POST /api/profile/avatar
 */
export const uploadAvatar = async (req, res) => {
  try {
    const { uid } = req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Build avatar URL (relative path to uploaded file)
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update profile with new avatar URL
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: uid },
      { avatarUrl },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl,
    });
  } catch (error) {
    console.error('Error in uploadAvatar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
      error: error.message,
    });
  }
};

/**
 * Delete user profile
 * @route DELETE /api/profile/delete
 */
export const deleteProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    // Delete profile from MongoDB
    const profile = await UserProfile.findOneAndDelete({ firebaseUid: uid });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Note: Firebase Auth user deletion should be handled separately
    // This only deletes the profile document in MongoDB

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile',
      error: error.message,
    });
  }
};
