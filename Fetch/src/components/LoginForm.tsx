// src/pages/LoginForm.tsx
import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import Button from '../components/Button'; 

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(name, email);
      onLoginSuccess();
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Name:</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Email:</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring"
        />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <Button type="submit" variant="login" className="w-full">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
