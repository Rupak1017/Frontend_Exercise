// src/pages/LoginPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/search');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/dog-playful.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-[0.7]"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center p-4 mt-16">
        <div className="bg-black bg-opacity-60 drop-shadow-2xl rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span>Welcome to Fur</span> 
            <span className="text-yellow-400">Buddy</span>
            <img 
              src="/images/bone_solid.png" 
              alt="Dog Icon" 
              className="h-5 w-5"
            />
          </h1>
          <p className="text-sm text-gray-200 mb-6">
            Find Your Fur Buddy—A Friend for Life Awaits
          </p>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
