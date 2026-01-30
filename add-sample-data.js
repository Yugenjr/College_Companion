import { addActivity, ACTIVITY_TYPES } from './services/progressService.js';

// Add some sample activities for testing
const addSampleData = () => {
  // Add question generation activities
  addActivity(ACTIVITY_TYPES.QUESTION_GENERATED, {
    topic: 'Data Structures and Algorithms',
    questionType: '2m',
    count: 5,
    tool: 'Question Generator',
  });

  addActivity(ACTIVITY_TYPES.QUESTION_GENERATED, {
    topic: 'Database Management Systems',
    questionType: '14m',
    count: 3,
    tool: 'Question Generator',
  });

  // Add attendance advice activities
  addActivity(ACTIVITY_TYPES.ATTENDANCE_ADVICE, {
    query: 'Should I take leave for family function?',
    tool: 'Attendance Advisor',
  });

  addActivity(ACTIVITY_TYPES.ATTENDANCE_ADVICE, {
    query: 'How many more classes can I miss?',
    tool: 'Attendance Advisor',
  });

  // Add study session activities
  addActivity(ACTIVITY_TYPES.STUDY_SESSION, {
    roomCode: 'ABC123',
    roomName: 'Room ABC123',
    duration: 45,
    tool: 'Study Arena',
  });

  addActivity(ACTIVITY_TYPES.STUDY_SESSION, {
    roomCode: 'XYZ789',
    roomName: 'Room XYZ789',
    duration: 30,
    tool: 'Study Arena',
  });

  // Add room join activities
  addActivity(ACTIVITY_TYPES.STUDY_ROOM_JOINED, {
    roomCode: 'ABC123',
    roomName: 'Room ABC123',
    tool: 'Study Arena',
  });

  console.log('Sample data added!');
};

// Only run if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.addSampleData = addSampleData;
} else {
  // Node.js environment
  addSampleData();
}