/**
 * Quick Test Guide for Progress Dashboard
 * Run these commands in browser console to verify functionality
 */

// 1. Import the service
import { addActivity, getProgressData, ACTIVITY_TYPES } from './src/services/progressService.js';

// 2. Add test activities
console.log("Adding sample activities...");

// Question generation
addActivity(ACTIVITY_TYPES.QUESTION_GENERATED, {
  topic: 'Data Structures - Arrays and Linked Lists',
  questionType: '2m',
  count: 10,
  tool: 'Question Generator',
});

addActivity(ACTIVITY_TYPES.QUESTION_GENERATED, {
  topic: 'Database Management Systems',
  questionType: '14m',
  count: 5,
  tool: 'Question Generator',
});

// Attendance advice
addActivity(ACTIVITY_TYPES.ATTENDANCE_ADVICE, {
  query: 'Should I take leave tomorrow for medical appointment?',
  tool: 'Attendance Advisor',
});

addActivity(ACTIVITY_TYPES.ATTENDANCE_ADVICE, {
  query: 'How many classes can I miss this month?',
  tool: 'Attendance Advisor',
});

// Study sessions
addActivity(ACTIVITY_TYPES.STUDY_SESSION, {
  roomCode: 'TEST01',
  roomName: 'Room TEST01',
  duration: 45,
  tool: 'Study Arena',
});

addActivity(ACTIVITY_TYPES.STUDY_SESSION, {
  roomCode: 'TEST02',
  roomName: 'Room TEST02',
  duration: 60,
  tool: 'Study Arena',
});

addActivity(ACTIVITY_TYPES.STUDY_SESSION, {
  roomCode: 'TEST03',
  roomName: 'Room TEST03',
  duration: 30,
  tool: 'Study Arena',
});

// Room joins
addActivity(ACTIVITY_TYPES.STUDY_ROOM_JOINED, {
  roomCode: 'TEST04',
  roomName: 'Room TEST04',
  tool: 'Study Arena',
});

console.log("✅ Sample activities added!");

// 3. View current progress data
const data = getProgressData();
console.log("📊 Current Progress Data:", data);
console.log("Total Activities:", data.activities.length);
console.log("Stats:", data.stats);

// 4. Clear data if needed
// import { clearProgressData } from './src/services/progressService.js';
// clearProgressData();
// console.log("🗑️ Progress data cleared!");
