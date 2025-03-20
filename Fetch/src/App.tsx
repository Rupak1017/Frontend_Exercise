import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DogSearchPage from './pages/DogSearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    // Router wraps the app to handle navigation.
    <Router>
      {/* Routes renders the appropriate page based on the URL */}
      <Routes>
        {/* Public route: login page, accessible by everyone */}
        <Route path="/" element={<LoginPage />} />
        {/* Protected route: only logged in users can access the dog search */}
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <DogSearchPage />
            </ProtectedRoute>
          } 
        />
        {/* Protected route: only logged in users can access favorites */}
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
