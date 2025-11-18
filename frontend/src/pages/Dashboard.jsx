import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SkillCard from '../components/SkillCard';
import { Plus, Search, Filter } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && skill.currentLevel < 10) ||
      (filter === 'completed' && skill.currentLevel >= 10);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your skill development and build your portfolio
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                <Plus size={32} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Start your skill journey
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add your first skill and begin tracking your progress
              </p>
              <Link to="/add-skill" className="btn-primary text-lg px-8 py-3">
                Add Your First Skill
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search skills..."
                    className="input pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    className="input pl-10 w-40"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Skills</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <Link to="/add-skill" className="btn-primary flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Skill</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map(skill => (
                <SkillCard key={skill._id} skill={skill} />
              ))}
            </div>

            {filteredSkills.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No skills match your current search and filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
