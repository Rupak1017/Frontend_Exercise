// src/pages/LoginForm.tsx
import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import Button from '../components/Button';

// This interface defines the props for the LoginForm component.
// onLoginSuccess: a function to call once the user has logged in successfully.
interface LoginFormProps {
  onLoginSuccess: () => void; // Callback to notify parent component on success.
}

// This component renders a login form for the user to enter their name and email.
// The form calls the loginUser API and triggers a callback on success.
const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  // State to hold the entered name.
  const [name, setName] = useState('');
  // State to hold the entered email.
  const [email, setEmail] = useState('');
  // State to hold any login error messages.
  const [error, setError] = useState('');

  // Handles the form submission by preventing default behavior,
  // calling the login API, and managing error states.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the API to log the user in with provided name and email.
      await loginUser(name, email);
      onLoginSuccess();
    } catch (err) {
      // Set error message if login fails.
      setError('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto  p-6">
      <div className="mb-4">
        {/* Label for the name input */}
        <label className="block text-sm font-bold mb-2 text-white">Hooman's Name:</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="xyz"
          className="w-full p-2 border rounded focus:outline-none focus:ring transition duration-300"
        />
      </div>
      <div className="mb-4">
        {/* Label for the email input */}
        <label className="block text-sm font-bold mb-2 text-white">Hooman's Email:</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="xyz@gmail.com"
          className="w-full p-2 border rounded focus:outline-none focus:ring transition duration-300"
        />
      </div>
      {/* Conditionally display an error message if the login API call fails */}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <Button type="submit" variant="login" className="w-full transform transition duration-300 hover:scale-105">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
