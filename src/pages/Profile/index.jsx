import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '@/services/api';
import { Camera, Save, LogOut, Settings, User, Mail, Phone, BookOpen, Calendar } from 'lucide-react';
import Select from '@/components/ui/Select';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    year: '',
    section: '',
    registerNumber: '',
    semester: 1,
    subjects: [],
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: {
      essentialAlerts: true,
      studyReminders: true,
      timetableChanges: true,
    },
    language: 'en',
  });
  
  const fileInputRef = useRef(null);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await API.getMyProfile();
      
      if (response.success && response.profile) {
        setProfile(response.profile);
        
        // Populate form data
        setFormData({
          name: response.profile.name || '',
          phone: response.profile.phone || '',
          department: response.profile.department || '',
          year: response.profile.year || '',
          section: response.profile.section || '',
          registerNumber: response.profile.registerNumber || '',
          semester: response.profile.semester || 1,
          subjects: response.profile.subjects || [],
        });
        
        // Populate settings
        setSettings(response.profile.settings || {
          darkMode: false,
          notifications: {
            essentialAlerts: true,
            studyReminders: true,
            timetableChanges: true,
          },
          language: 'en',
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      subjects: updatedSubjects,
    }));
  };

  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { subjectName: '', staffName: '', credits: 0 }],
    }));
  };

  const removeSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');
      
      const response = await API.updateProfile(formData);
      
      if (response.success) {
        setProfile(response.profile);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsChange = async (settingPath, value) => {
    try {
      let updatedSettings = { ...settings };
      
      // Handle nested paths (e.g., "notifications.essentialAlerts")
      if (settingPath.includes('.')) {
        const [parent, child] = settingPath.split('.');
        updatedSettings[parent] = {
          ...updatedSettings[parent],
          [child]: value,
        };
      } else {
        updatedSettings[settingPath] = value;
      }
      
      setSettings(updatedSettings);
      
      // Save to backend
      const response = await API.updateSettings(updatedSettings);
      
      if (response.success) {
        setSuccessMessage('Settings updated!');
        setTimeout(() => setSuccessMessage(''), 2000);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
      setError('Failed to update settings.');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, WebP)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    try {
      setUploadingAvatar(true);
      setError('');
      
      const response = await API.uploadAvatar(file);
      
      if (response.success) {
        // Update profile with new avatar URL
        setProfile((prev) => ({
          ...prev,
          avatarUrl: response.avatarUrl,
        }));
        setSuccessMessage('Avatar updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      setError('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505' }} className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="neon-card p-6">
          <h2 className="text-2xl font-bold glow-purple mb-6">Profile</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {profile?.avatarUrl ? (
                    <img
                      src={`http://localhost:5000${profile.avatarUrl}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentUser?.email?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formData.name || 'Student'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
                {formData.registerNumber && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reg: {formData.registerNumber}</p>
                )}
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Form */}
          <div className="lg:col-span-2 neon-card p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="neon-input w-full px-4 py-2"
                    placeholder="Your branch"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="neon-input w-full px-4 py-2"
                    placeholder="Your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="neon-input w-full px-4 py-2"
                    placeholder="e.g., Computer Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="neon-input w-full px-4 py-2"
                    placeholder="e.g., 2nd Year"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="neon-input w-full px-4 py-2"
                    placeholder="e.g., A"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Register Number
                  </label>
                  <input
                    type="text"
                    name="registerNumber"
                    value={formData.registerNumber}
                    onChange={handleInputChange}
                    className="neon-input w-full px-4 py-2"
                    placeholder="Registration number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="neon-input w-full px-4 py-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subjects */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subjects
                  </label>
                  <button
                    type="button"
                    onClick={addSubject}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    + Add Subject
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.subjects.map((subject, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={subject.subjectName}
                        onChange={(e) => handleSubjectChange(index, 'subjectName', e.target.value)}
                        className="neon-input flex-1 px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Staff Name"
                        value={subject.staffName}
                        onChange={(e) => handleSubjectChange(index, 'staffName', e.target.value)}
                        className="neon-input flex-1 px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Credits"
                        value={subject.credits}
                        onChange={(e) => handleSubjectChange(index, 'credits', parseInt(e.target.value) || 0)}
                        className="neon-input w-20 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="px-3 py-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Settings Panel */}
          <div className="neon-card p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </h2>
            
            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingsChange('darkMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              {/* Notifications */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notifications</p>
                
                <div className="space-y-2 pl-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Essential Alerts</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.essentialAlerts}
                      onChange={(e) => handleSettingsChange('notifications.essentialAlerts', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Study Reminders</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.studyReminders}
                      onChange={(e) => handleSettingsChange('notifications.studyReminders', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Timetable Changes</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.timetableChanges}
                      onChange={(e) => handleSettingsChange('notifications.timetableChanges', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Language
                </label>
                <Select
                  value={settings.language}
                  onChange={(value) => handleSettingsChange('language', value)}
                  options={[                    
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' },
                    { value: 'hi', label: 'Hindi' },
                    { value: 'ta', label: 'Tamil' },
                    { value: 'zh', label: 'Chinese' },
                    { value: 'ja', label: 'Japanese' },
                    { value: 'ru', label: 'Russian' },
                  ]}
                  placeholder="Select language"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
