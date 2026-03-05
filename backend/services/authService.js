// Authentication Service
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '7d';

export async function signup({ username, email, password, role }) {
  const user = new User({
    _id: email,
    uid: email,
    email,
    profile: { fullName: username, email },
    password,
    role: role || 'user',
  });
  await user.save();
  return generateToken(user);
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !user.password) throw new Error('Invalid credentials');
  const match = await user.comparePassword(password);
  if (!match) throw new Error('Invalid credentials');
  return generateToken(user);
}

export function generateToken(user) {
  return jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function getUserByToken(token) {
  const payload = verifyToken(token);
  return await User.findOne({ uid: payload.uid });
}
