// src/api/locations.ts
import axios from 'axios';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export const searchLocations = async (filters: {
  city?: string,
  states?: string[],
  geoBoundingBox?: any,
  size?: number,
  from?: number
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/locations/search`,
      filters,
      { withCredentials: true }
    );
    return response.data; // Expected to return { results: Location[], total: number }
  } catch (error) {
    console.error("Error searching locations:", error);
    throw error;
  }
};
