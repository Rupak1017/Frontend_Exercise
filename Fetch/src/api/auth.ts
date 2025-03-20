// This module handles authentication by making API calls to the backend.

import axios from 'axios';

// Base URL for the API. Change if the endpoint is updated.
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Function to log in a user using their name and email.
// Sends the login request with credentials allowed (cookies).
export const loginUser = async (name: string, email: string): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { name, email },
      { withCredentials: true } // Ensures cookies are included for session management
    );
    
    return response.data; // Return data received from the API
  } catch (error) {
    console.error("Login failed:", error); 
    throw error; 
  }
};

// Function to log out a user.
// Makes sure that the API request includes credentials.
export const logoutUser = async (): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true } // Ensures cookies are included for session continuity
    );
    return response.data; // Return data received from the API on logout
  } catch (error) {
    console.error("Logout failed:", error); 
    throw error; 
  }
};
