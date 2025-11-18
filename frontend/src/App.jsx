import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddSkill from './pages/AddSkill';
import SkillDetail from './pages/SkillDetail';
import AddProgress from './pages/AddProgress';
import Settings from './pages/Settings';
import PublicPortfolio from './pages/PublicPortfolio';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* Public routes */}
            <Route path="/u/:username/:skillName" element={<PublicPortfolio />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <>
                    <Header />
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/add-skill" element={<AddSkill />} />
                      <Route path="/skill/:skillId" element={<SkillDetail />} />
                      <Route path="/skill/:skillId/add-progress" element={<AddProgress />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
