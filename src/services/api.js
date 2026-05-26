/**
 * API Utility for making authenticated requests to backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Get Firebase ID token from current user
 */
export const getAuthToken = async () => {
  const { auth } = await import('@/firebase/config');
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await user.getIdToken();
};

/**
 * Make authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/api/questions/generate')
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Upload file with authentication
 * @param {string} endpoint - Upload endpoint
 * @param {File} file - File to upload
 * @param {object} additionalData - Additional form data
 * @returns {Promise<object>} - Response data
 */
export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  return apiRequest(endpoint, {
    method: 'POST',
    body: formData,
  });
};

/**
 * API endpoints
 */
export const API = {
  // Questions
  generateQuestions: (data) => apiRequest('/api/questions/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getQuestionHistory: (userId) => apiRequest(`/api/questions/history?userId=${userId}`),

  // Survival Plan
  generateSurvivalPlan: (data) => apiRequest('/api/survival/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getSurvivalHistory: (userId) => apiRequest(`/api/survival/history?userId=${userId}`),

  // Essentials
  extractEssentials: (file) => uploadFile('/api/essentials/extract', file),
  getEssentialsHistory: (userId) => apiRequest(`/api/essentials/history?userId=${userId}`),

  // Revision
  generateRevisionPlan: (data) => apiRequest('/api/revision/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getRevisionHistory: (userId) => apiRequest(`/api/revision/history?userId=${userId}`),

  // Notes
  createNote: (data) => apiRequest('/api/notes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getNotes: (userId, type) => apiRequest(`/api/notes?userId=${userId}${type ? `&type=${type}` : ''}`),
  updateNote: (id, data) => apiRequest(`/api/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteNote: (id) => apiRequest(`/api/notes/${id}`, {
    method: 'DELETE',
  }),

  // Doubt Solver
  askDoubt: (data) => apiRequest('/api/doubt/ask', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getDoubtHistory: (userId) => apiRequest(`/api/doubt/history?userId=${userId}`),

  // Attendance Advisor
  queryAttendance: (data) => apiRequest('/api/attendance/query', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAttendanceHistory: (userId) => apiRequest(`/api/attendance/history?userId=${userId}`),

  // Profile
  getMyProfile: () => apiRequest('/api/profile/me'),
  updateProfile: (data) => apiRequest('/api/profile/update', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updateSettings: (data) => apiRequest('/api/profile/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiRequest('/api/profile/avatar', {
      method: 'POST',
      body: formData,
    });
  },
  deleteProfile: () => apiRequest('/api/profile/delete', {
    method: 'DELETE',
  }),
  // Kindness Auction House
  getAuctionItems: () => apiRequest('/api/auction/items'),
  bidKindness: (itemId, data) => apiRequest(`/api/auction/${itemId}/bid`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  claimItem: (itemId) => apiRequest(`/api/auction/${itemId}/claim`, {
    method: 'POST',
  }),
  donateItem: (itemId, data) => apiRequest(`/api/auction/${itemId}/donate`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  tradeItem: (itemId, data) => apiRequest(`/api/auction/${itemId}/trade`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  startKindnessChain: (itemId, data) => apiRequest(`/api/auction/${itemId}/chain`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export default API;
