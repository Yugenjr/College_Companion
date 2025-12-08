/**
 * Custom Hook for Protected API Calls with Firebase Auth
 * Usage in React components
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`;

export const useProtectedAPI = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Make authenticated API call
   */
  const callAPI = async (endpoint, options = {}) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      // Get Firebase ID token
      const token = await currentUser.getIdToken();

      // Make request
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': options.body instanceof FormData ? undefined : 'application/json'
        },
        body: options.body instanceof FormData ? options.body : JSON.stringify(options.body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      setLoading(false);
      return data;

    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Create or get user
   */
  const ensureUser = async () => {
    return await callAPI('/users/create', { method: 'POST' });
  };

  /**
   * Get user data
   */
  const getUserData = async (uid) => {
    return await callAPI(`/users/${uid}`, { method: 'GET' });
  };

  /**
   * Generate questions
   */
  const generateQuestions = async (syllabus, questionType) => {
    return await callAPI('/questions/generate', {
      method: 'POST',
      body: { syllabus, questionType }
    });
  };

  /**
   * Generate survival plan
   */
  const generateSurvivalPlan = async (params) => {
    return await callAPI('/survival/generate', {
      method: 'POST',
      body: params
    });
  };

  /**
   * Attendance query
   */
  const queryAttendance = async (question, attendanceData = {}) => {
    return await callAPI('/attendance/query', {
      method: 'POST',
      body: { question, attendanceData }
    });
  };

  /**
   * Extract essentials from file
   */
  const extractEssentials = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await callAPI('/essentials/extract', {
      method: 'POST',
      body: formData
    });
  };

  /**
   * Generate revision plan
   */
  const generateRevisionPlan = async (syllabusText, preferences = {}) => {
    return await callAPI('/revision/generate', {
      method: 'POST',
      body: { syllabusText, preferences }
    });
  };

  /**
   * Ask doubt
   */
  const askDoubt = async (question, context = '') => {
    return await callAPI('/doubt/ask', {
      method: 'POST',
      body: { question, context }
    });
  };

  /**
   * Notes CRUD
   */
  const createNote = async (title, content, tags = []) => {
    return await callAPI('/notes', {
      method: 'POST',
      body: { title, content, tags }
    });
  };

  const getNotes = async () => {
    return await callAPI(`/notes?uid=${currentUser.uid}`, { method: 'GET' });
  };

  const updateNote = async (id, updates) => {
    return await callAPI(`/notes/${id}`, {
      method: 'PUT',
      body: updates
    });
  };

  const deleteNote = async (id) => {
    return await callAPI(`/notes/${id}`, { method: 'DELETE' });
  };

  return {
    loading,
    error,
    callAPI,
    ensureUser,
    getUserData,
    generateQuestions,
    generateSurvivalPlan,
    queryAttendance,
    extractEssentials,
    generateRevisionPlan,
    askDoubt,
    createNote,
    getNotes,
    updateNote,
    deleteNote
  };
};

export default useProtectedAPI;
