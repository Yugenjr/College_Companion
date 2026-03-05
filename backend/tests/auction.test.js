// Auction Service Integration Tests
import request from 'supertest';
import app from '../server.js';
describe('Auction API', () => {
  let token;
  beforeAll(async () => {
    // Signup and login to get token
    await request(app)
      .post('/api/auth/signup')
      .send({ username: 'auctionuser', email: 'auction@example.com', password: 'auctionpass' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'auction@example.com', password: 'auctionpass' });
    token = res.body.token;
  });
  it('should get auction items', async () => {
    const res = await request(app)
      .get('/api/auction/items')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
