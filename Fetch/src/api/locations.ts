// src/api/locations.ts
import axios from 'axios';

// We define the base URL for our API calls to keep our endpoint references consistent.
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

// This function performs a location search by sending filter criteria to the backend.
// It returns data including a list of locations and the total count.
export const searchLocations = async (filters: {
  city?: string,
  states?: string[],
  geoBoundingBox?: any,
  size?: number,
  from?: number
}) => {
  try {
    // Sending a POST request to the location search endpoint with the provided filters.
    const response = await axios.post(
      `${API_BASE_URL}/locations/search`,
      filters,
      { withCredentials: true }
    );
    // The response data contains the search results.
    return response.data; // Expected: { results: Location[], total: number }
  } catch (error) {
    // If an error occurs, log it with a message for debugging and rethrow for further handling.
    console.error("Error searching locations:", error);
    throw error;
  }
};
