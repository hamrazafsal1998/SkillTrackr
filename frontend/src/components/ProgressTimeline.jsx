import React from 'react';

const ProgressTimeline = ({ progressLogs }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://skilltrackr.onrender.com/api';
  const sortedLogs = [...progressLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedLogs.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No progress logs yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Start tracking your progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Progress Timeline
      </h3>
      <div className="space-y-4">
        {sortedLogs.map((log, index) => (
          <div key={log._id} className="flex space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              {index < sortedLogs.length - 1 && (
                <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-600 mt-2"></div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                      Level {log.level}/10
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {log.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {log.description}
                    </p>
                  )}
                  {log.image && (
                    <div className="mt-3">
                      <img
                        src={`${apiUrl}${log.image}`}
                        alt="Progress"
                        className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTimeline;
