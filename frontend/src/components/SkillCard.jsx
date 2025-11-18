import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Eye } from 'lucide-react';

const SkillCard = ({ skill }) => {
  const progressPercentage = skill.currentLevel ? Math.round((skill.currentLevel / 10) * 100) : 0;
  const daysLeft = skill.targetDate ? Math.ceil((new Date(skill.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

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

  return (
    <div className="card group hover:scale-105 transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getIcon(skill.icon)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {skill.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Level {skill.startingLevel} → {skill.currentLevel || skill.startingLevel}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {progressPercentage}%
          </div>
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Goal:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{skill.mainGoal}</span>
        </div>
        {daysLeft !== null && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Days left:</span>
            <span className={`font-medium ${daysLeft < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)} overdue` : daysLeft}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Last update:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {skill.lastUpdate ? new Date(skill.lastUpdate).toLocaleDateString() : 'Never'}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Link
          to={`/skill/${skill._id}`}
          className="flex-1 btn-primary text-center text-sm flex items-center justify-center space-x-2"
        >
          <Eye size={16} />
          <span>View Skill</span>
        </Link>
        <Link
          to={`/skill/${skill._id}/add-progress`}
          className="btn-secondary text-sm flex items-center justify-center space-x-2"
        >
          <TrendingUp size={16} />
          <span>Add Progress</span>
        </Link>
      </div>
    </div>
  );
};

export default SkillCard;
