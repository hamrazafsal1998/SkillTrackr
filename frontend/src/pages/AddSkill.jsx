import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Target, Zap } from 'lucide-react';
import api from '../services/api';

const AddSkill = () => {
  const [formData, setFormData] = useState({
    name: '',
    icon: 'default',
    startingLevel: 1,
    mainGoal: '',
    targetDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const skillIcons = [
    { value: 'keyboard', label: 'Programming', emoji: '⌨️' },
    { value: 'dumbbell', label: 'Fitness', emoji: '🏋️' },
    { value: 'brush', label: 'Art', emoji: '🎨' },
    { value: 'music', label: 'Music', emoji: '🎵' },
    { value: 'book', label: 'Learning', emoji: '📚' },
    { value: 'code', label: 'Coding', emoji: '💻' },
    { value: 'camera', label: 'Photography', emoji: '📷' },
    { value: 'default', label: 'Other', emoji: '🎯' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/skills', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Add New Skill
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start tracking a new skill and set your goals
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="label">
                Skill Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="input"
                placeholder="e.g., JavaScript, Guitar, Weightlifting"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">
                Skill Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {skillIcons.map(icon => (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: icon.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.icon === icon.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{icon.emoji}</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {icon.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="startingLevel" className="label">
                Starting Level (1-10)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="startingLevel"
                  name="startingLevel"
                  min="1"
                  max="10"
                  value={formData.startingLevel}
                  onChange={handleChange}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-primary-600 dark:text-primary-400 min-w-[2rem]">
                  {formData.startingLevel}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>

            <div>
              <label htmlFor="mainGoal" className="label">
                Main Goal
              </label>
              <textarea
                id="mainGoal"
                name="mainGoal"
                required
                rows={3}
                className="input"
                placeholder="What do you want to achieve with this skill?"
                value={formData.mainGoal}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="targetDate" className="label">
                Target Date (Optional)
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  className="input pl-10"
                  value={formData.targetDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                When do you plan to reach your goal?
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Skill...' : 'Add Skill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSkill;
