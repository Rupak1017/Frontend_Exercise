import axios from 'axios';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export const loginUser = async (name: string, email: string): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { name, email },
      { withCredentials: true }  // ensures the auth cookie is handled automatically
    );
    // The auth cookie (fetch-access-token) expires in 1 hour.
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};
