import User from '../models/User.js';

/**
 * Get or create user with all required fields initialized
 * @param {string} uid - Firebase UID
 * @param {string} email - User email
 * @returns {Promise<User>} User document
 */
export const getOrCreateUser = async (uid, email = '') => {
    let user = await User.findOne({ uid });

    if (!user) {
        user = new User({
            _id: uid,
            uid,
            email: email || undefined,
            profile: {
                fullName: '',
                email: email,
                photoURL: '',
                phone: '',
                department: '',
                year: '',
                collegeName: '',
                course: '',
                semester: '',
                age: null,
                updatedAt: new Date()
            },
            survivalKit: {
                essentials: [],
                revisionStrategies: [],
                survivalPlans: []
            },
            notesRepository: [],
            attendanceAdvisor: {
                history: []
            },
            questionGenerator: {
                savedQuestions: []
            }
        });

        await user.save();
    }

    return user;
};

export default {
    getOrCreateUser
};
