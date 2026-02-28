// User Model Unit Tests
import mongoose from 'mongoose';
import User from '../models/User.js';
describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  it('should hash password before save', async () => {
    const user = new User({
      _id: 'testid',
      uid: 'testid',
      email: 'test@example.com',
      password: 'plainpass',
    });
    await user.save();
    expect(user.password).not.toBe('plainpass');
  });
  it('should compare password correctly', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    const match = await user.comparePassword('plainpass');
    expect(match).toBe(true);
  });
});
