import axios from 'axios';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';


export const fetchDogsSearch = async (from?: number, size: number = 25) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dogs/search`,
      {
        params: { sort: 'breed:asc', size, from },
        withCredentials: true,
      }
    );
  
    return response.data;
  } catch (error) {
    console.error("Error fetching dog search results:", error);
    throw error;
  }
};


export const fetchDogsDetails = async (dogIds: string[]) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/dogs`,
      dogIds, // Send an array of dog IDs
      { withCredentials: true }
    );
    return response.data; // Returns array of dog objects
  } catch (error) {
    console.error("Error fetching dog details:", error);
    throw error;
  }
};
