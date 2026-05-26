// Frontend API Service Unit Tests
import API from '../services/api.js';
describe('API Service', () => {
  it('should throw error for failed request', async () => {
    await expect(API.getMyProfile()).rejects.toThrow();
  });
  // Add more tests for endpoints as needed
});
