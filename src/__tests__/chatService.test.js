// Frontend Chat Service Unit Tests
import * as chatService from '../services/chatService.js';
describe('Chat Service', () => {
  it('should connect and disconnect', () => {
    chatService.connectChat({ token: 'test', roomId: 'room1', username: 'user1' });
    chatService.disconnectChat();
  });
  // Add more tests for chat events as needed
});
