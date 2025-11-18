import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProgressGraph from '../components/ProgressGraph';
import ProgressTimeline from '../components/ProgressTimeline';
import { Calendar, Target, TrendingUp, Plus, Edit } from 'lucide-react';
import api from '../services/api';

const SkillDetail = () => {
  const { skillId } = useParams();
  const [skill, setSkill] = useState(null);
  const [progressLogs, setProgressLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkillData();
  }, [skillId]);

  const fetchSkillData = async () => {
    try {
      const [skillResponse, progressResponse] = await Promise.all([
        api.get(`/skills/${skillId}`),
        api.get(`/progress/${skillId}`)
      ]);
      setSkill(skillResponse.data);
      setProgressLogs(progressResponse.data);
    } catch (err) {
      setError('Failed to load skill data');
      console.error('Error fetching skill data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      keyboard: '⌨️',
      dumbbell: '🏋️',
      brush: '🎨',
      music: '🎵',
      book: '📚',
      code: '💻',
      camera: '📷',
      default: '🎯'
    };
    return icons[iconName] || icons.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Skill not found'}</p>
            <Link to="/dashboard" className="btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = skill.currentLevel ? Math.round((skill.currentLevel / 10) * 100) : 0;
  const daysLeft = skill.targetDate ? Math.ceil((new Date(skill.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getIcon(skill.icon)}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {skill.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Level {skill.startingLevel} → {skill.currentLevel || skill.startingLevel}/10
                </p>
              </div>
            </div>
            <Link
              to={`/skill/${skillId}/add-progress`}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Progress</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {progressPercentage}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Goal</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {skill.mainGoal}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Target Date</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {skill.targetDate ? new Date(skill.targetDate).toLocaleDateString() : 'Not set'}
                </p>
                {daysLeft !== null && (
                  <p className={`text-sm mt-1 ${daysLeft < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Graph */}
        <div className="mb-8">
          <ProgressGraph progressLogs={progressLogs} />
        </div>

        {/* Progress Timeline */}
        <div className="mb-8">
          <ProgressTimeline progressLogs={progressLogs} />
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Link to="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
