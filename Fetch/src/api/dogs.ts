// This file contains functions that call the dog API using axios.
// Each function is responsible for a specific endpoint in the dog API.

import axios from 'axios';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

// This function fetches a list of dogs based on search parameters.
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

// This function fetches detailed information for the provided dog IDs.
export const fetchDogsDetails = async (dogIds: string[]) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/dogs`,
      dogIds,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dog details:", error);
    throw error;
  }
};

// This function retrieves all breeds, then for each breed,
// it gets a representative dog ID and fetches detailed info in batches.
export const fetchAllDogsUsingBreeds = async () => {
  try {
    // Get the list of all available dog breeds
    const breedsResponse = await axios.get(
      `${API_BASE_URL}/dogs/breeds`,
      { withCredentials: true }
    );
    const breeds: string[] = breedsResponse.data;
    let allDogIds: string[] = [];
    for (const breed of breeds) {
      // Get one dog ID per breed
      const searchResponse = await axios.get(
        `${API_BASE_URL}/dogs/search`,
        { params: { breeds: [breed], size: 1, from: 0 }, withCredentials: true }
      );
      const result = searchResponse.data;
      if (result.resultIds && result.resultIds.length > 0) {
        allDogIds.push(result.resultIds[0]);
      }
    }
    // Remove duplicate IDs
    allDogIds = Array.from(new Set(allDogIds));

    // Helper function to fetch details in batches
    const batchFetch = async (ids: string[]): Promise<any[]> => {
      const batches = [];
      for (let i = 0; i < ids.length; i += 100) {
        batches.push(ids.slice(i, i + 100));
      }
      const results = await Promise.all(batches.map(batch => fetchDogsDetails(batch)));
      return results.flat();
    };
    // Get detailed information for each dog ID
    const dogDetails = await batchFetch(allDogIds);
    return dogDetails;
  } catch (error) {
    console.error("Error fetching all dogs using breeds:", error);
    throw error;
  }
};

// This function matches provided favorite dog IDs with available dogs.
// It returns an object with a match string.
export const matchDogs = async (favoriteIds: string[]) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/dogs/match`,
      favoriteIds,
      { withCredentials: true }
    );
    return response.data; // Expected to return { match: string }
  } catch (error) {
    console.error("Error matching dogs:", error);
    throw error;
  }
};
