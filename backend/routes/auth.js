// Auth Routes
import express from 'express';
import { signup, login } from '../services/authService.js';
import { validateSignup, validateLogin } from '../utils/validateUserInput.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
  if (!validateSignup(req.body)) {
    return res.status(400).json({ error: 'Invalid signup data' });
  }
  try {
    const token = await signup(req.body);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  if (!validateLogin(req.body)) {
    return res.status(400).json({ error: 'Invalid login data' });
  }
  try {
    const token = await login(req.body);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
