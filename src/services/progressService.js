/**
 * Progress Tracking Service
 * Manages user activity data for the Progress Dashboard
 * Uses localStorage for MVP, can be extended to backend later
 */

const STORAGE_KEY = 'college_companion_progress';

// Activity types
export const ACTIVITY_TYPES = {
  QUESTION_GENERATED: 'question_generated',
  ATTENDANCE_ADVICE: 'attendance_advice',
  STUDY_SESSION: 'study_session',
  STUDY_ROOM_JOINED: 'study_room_joined',
};

/**
 * Get all progress data from localStorage
 */
export const getProgressData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
      activities: [],
      stats: {
        totalQuestionsGenerated: 0,
        totalAttendanceAdvice: 0,
        totalStudySessions: 0,
        totalStudyTime: 0, // in minutes
        currentStreak: 0,
        longestStreak: 0,
      },
      lastUpdated: null,
    };
  } catch (error) {
    console.error('Error loading progress data:', error);
    return {
      activities: [],
      stats: {
        totalQuestionsGenerated: 0,
        totalAttendanceAdvice: 0,
        totalStudySessions: 0,
        totalStudyTime: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
      lastUpdated: null,
    };
  }
};

/**
 * Save progress data to localStorage
 */
export const saveProgressData = (data) => {
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress data:', error);
  }
};

/**
 * Add a new activity
 */
export const addActivity = (type, details) => {
  const data = getProgressData();

  const activity = {
    id: Date.now().toString(),
    type,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    ...details,
  };

  data.activities.unshift(activity); // Add to beginning for chronological order (newest first)

  // Update stats based on activity type
  switch (type) {
    case ACTIVITY_TYPES.QUESTION_GENERATED:
      data.stats.totalQuestionsGenerated++;
      break;
    case ACTIVITY_TYPES.ATTENDANCE_ADVICE:
      data.stats.totalAttendanceAdvice++;
      break;
    case ACTIVITY_TYPES.STUDY_SESSION:
      data.stats.totalStudySessions++;
      if (details.duration) {
        data.stats.totalStudyTime += details.duration;
      }
      break;
    case ACTIVITY_TYPES.STUDY_ROOM_JOINED:
      // This could be counted separately or as part of study sessions
      break;
  }

  // Update streaks (simplified - counts days with any activity)
  updateStreaks(data);

  saveProgressData(data);
  return activity;
};

/**
 * Update streak calculations
 */
const updateStreaks = (data) => {
  const activities = data.activities;
  if (activities.length === 0) return;

  // Get unique dates with activities
  const activityDates = [...new Set(activities.map(a => a.date))].sort().reverse();

  let currentStreak = 0;
  let longestStreak = data.stats.longestStreak || 0;

  if (activityDates.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Check if there's activity today or yesterday
    if (activityDates.includes(today) || activityDates.includes(yesterday)) {
      currentStreak = 1;
      let checkDate = new Date(today);

      // Count consecutive days backwards
      for (let i = 0; i < activityDates.length; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (activityDates.includes(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  data.stats.currentStreak = currentStreak;
  data.stats.longestStreak = Math.max(longestStreak, currentStreak);
};

/**
 * Get activities for a specific date range
 */
export const getActivitiesInRange = (startDate, endDate) => {
  const data = getProgressData();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return data.activities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    return activityDate >= start && activityDate <= end;
  });
};

/**
 * Get weekly activity summary
 */
export const getWeeklySummary = () => {
  const data = getProgressData();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weekActivities = getActivitiesInRange(weekAgo, now);

  const summary = {
    totalActivities: weekActivities.length,
    questionsGenerated: weekActivities.filter(a => a.type === ACTIVITY_TYPES.QUESTION_GENERATED).length,
    attendanceAdvice: weekActivities.filter(a => a.type === ACTIVITY_TYPES.ATTENDANCE_ADVICE).length,
    studySessions: weekActivities.filter(a => a.type === ACTIVITY_TYPES.STUDY_SESSION).length,
    studyTime: weekActivities
      .filter(a => a.type === ACTIVITY_TYPES.STUDY_SESSION && a.duration)
      .reduce((total, a) => total + a.duration, 0),
  };

  return summary;
};

/**
 * Get monthly activity summary
 */
export const getMonthlySummary = () => {
  const data = getProgressData();
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const monthActivities = getActivitiesInRange(monthAgo, now);

  const summary = {
    totalActivities: monthActivities.length,
    questionsGenerated: monthActivities.filter(a => a.type === ACTIVITY_TYPES.QUESTION_GENERATED).length,
    attendanceAdvice: monthActivities.filter(a => a.type === ACTIVITY_TYPES.ATTENDANCE_ADVICE).length,
    studySessions: monthActivities.filter(a => a.type === ACTIVITY_TYPES.STUDY_SESSION).length,
    studyTime: monthActivities
      .filter(a => a.type === ACTIVITY_TYPES.STUDY_SESSION && a.duration)
      .reduce((total, a) => total + a.duration, 0),
  };

  return summary;
};

/**
 * Get activity data for charts (last 30 days)
 */
export const getChartData = () => {
  const data = getProgressData();
  const now = new Date();
  const chartData = [];

  // Generate data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    const dayActivities = data.activities.filter(a => a.date === dateStr);

    chartData.push({
      date: dateStr,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      activities: dayActivities.length,
      questions: dayActivities.filter(a => a.type === ACTIVITY_TYPES.QUESTION_GENERATED).length,
      attendance: dayActivities.filter(a => a.type === ACTIVITY_TYPES.ATTENDANCE_ADVICE).length,
      study: dayActivities.filter(a => a.type === ACTIVITY_TYPES.STUDY_SESSION).length,
    });
  }

  return chartData;
};

/**
 * Clear all progress data (for testing or reset)
 */
export const clearProgressData = () => {
  localStorage.removeItem(STORAGE_KEY);
};