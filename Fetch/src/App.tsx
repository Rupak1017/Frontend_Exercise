import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DogSearchPage from './pages/DogSearchPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <DogSearchPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
