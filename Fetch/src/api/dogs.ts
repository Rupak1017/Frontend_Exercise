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
      dogIds,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dog details:", error);
    throw error;
  }
};

export const fetchAllDogsUsingBreeds = async () => {
  try {
 
    const breedsResponse = await axios.get(
      `${API_BASE_URL}/dogs/breeds`,
      { withCredentials: true }
    );
    const breeds: string[] = breedsResponse.data;
    let allDogIds: string[] = [];
   
    for (const breed of breeds) {
      const searchResponse = await axios.get(
        `${API_BASE_URL}/dogs/search`,
        { params: { breeds: [breed], size: 1, from: 0 }, withCredentials: true }
      );
      const result = searchResponse.data;
      if (result.resultIds && result.resultIds.length > 0) {
        allDogIds.push(result.resultIds[0]);
      }
    }
    allDogIds = Array.from(new Set(allDogIds));
    
    const batchFetch = async (ids: string[]): Promise<any[]> => {
      const batches = [];
      for (let i = 0; i < ids.length; i += 100) {
        batches.push(ids.slice(i, i + 100));
      }
      const results = await Promise.all(batches.map(batch => fetchDogsDetails(batch)));
      return results.flat();
    };
    const dogDetails = await batchFetch(allDogIds);
    return dogDetails;
  } catch (error) {
    console.error("Error fetching all dogs using breeds:", error);
    throw error;
  }
};
