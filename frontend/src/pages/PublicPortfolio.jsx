import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProgressGraph from '../components/ProgressGraph';
import ProgressTimeline from '../components/ProgressTimeline';
import { Calendar, Target, User, ExternalLink } from 'lucide-react';
import api from '../services/api';

const PublicPortfolio = () => {
  const { username, skillName } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolioData();
  }, [username, skillName]);

  const fetchPortfolioData = async () => {
    try {
      const response = await api.get(`/public/${username}/${skillName}`);
      setPortfolioData(response.data);
    } catch (err) {
      setError('Portfolio not found or not public');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                <ExternalLink size={32} className="text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Portfolio Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {error || 'This portfolio might be private or doesn\'t exist.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { skill, progressLogs, user: portfolioUser } = portfolioData;
  const progressPercentage = skill.currentLevel ? Math.round((skill.currentLevel / 10) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-5xl">{getIcon(skill.icon)}</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {skill.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  by {portfolioUser.username}
                </p>
              </div>
            </div>
            {portfolioUser.bio && (
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                {portfolioUser.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {progressPercentage}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">Progress</p>
            <div className="mt-4">
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {skill.currentLevel || skill.startingLevel}/10
            </div>
            <p className="text-gray-600 dark:text-gray-400">Current Level</p>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {progressLogs.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Progress Updates</p>
          </div>
        </div>

        {/* Goal */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Goal
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            {skill.mainGoal}
          </p>
          {skill.targetDate && (
            <div className="mt-4 flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Calendar size={16} />
              <span>Target: {new Date(skill.targetDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Progress Graph */}
        <div className="mb-8">
          <ProgressGraph progressLogs={progressLogs} />
        </div>

        {/* Progress Timeline */}
        <div className="mb-8">
          <ProgressTimeline progressLogs={progressLogs} />
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Built with SkillTrackr • Track your skills, share your progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolio;
