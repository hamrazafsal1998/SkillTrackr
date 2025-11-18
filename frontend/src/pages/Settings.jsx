import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, FileText, Moon, Sun } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile, theme, toggleTheme } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Profile Settings
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'}`}>
                  <p className="text-sm">{message}</p>
                </div>
              )}

              <div>
                <label htmlFor="username" className="label">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="input pl-10"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input pl-10"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="label">
                  Bio
                </label>
                <div className="relative">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    className="input pl-10"
                    placeholder="Tell others about yourself..."
                    value={formData.bio}
                    onChange={handleChange}
                  />
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Theme Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Appearance
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Theme
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your preferred theme
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={20} />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={20} />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Member since</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account status</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
