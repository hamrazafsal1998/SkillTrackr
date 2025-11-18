import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Upload, X } from 'lucide-react';
import api from '../services/api';

const AddProgress = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [formData, setFormData] = useState({
    level: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchSkill();
  }, [skillId]);

  const fetchSkill = async () => {
    try {
      const response = await api.get(`/skills/${skillId}`);
      setSkill(response.data);
      setFormData(prev => ({ ...prev, level: response.data.currentLevel || response.data.startingLevel }));
    } catch (err) {
      setError('Failed to load skill');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('level', formData.level);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await api.post(`/progress/${skillId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/skill/${skillId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add progress');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">Skill not found</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Add Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your progress for {skill.name}
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
              <label htmlFor="level" className="label">
                Current Level (1-10)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="level"
                  name="level"
                  min="1"
                  max="10"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-primary-600 dark:text-primary-400 min-w-[2rem]">
                  {formData.level}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="label">
                Progress Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="input"
                placeholder="Describe what you've accomplished, challenges faced, or next steps..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="label">
                Progress Photo (Optional)
              </label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Progress preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Upload a photo to document your progress
                    </div>
                    <label htmlFor="image-upload" className="btn-secondary cursor-pointer">
                      <Upload size={16} className="mr-2" />
                      Choose Image
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/skill/${skillId}`)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Progress...' : 'Add Progress'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProgress;
