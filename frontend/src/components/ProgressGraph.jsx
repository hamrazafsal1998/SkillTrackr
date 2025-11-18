import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressGraph = ({ progressLogs }) => {
  // Prepare data for the chart
  const chartData = progressLogs
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(log => ({
      date: new Date(log.date).toLocaleDateString(),
      level: log.level,
      fullDate: log.date
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {`Date: ${label}`}
          </p>
          <p className="text-sm text-primary-600 dark:text-primary-400">
            {`Level: ${payload[0].value}/10`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No progress data available yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add your first progress log to see the graph!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Progress Over Time
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              fontSize={12}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="level"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressGraph;
