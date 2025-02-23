import axios from 'axios';

// Create axios instance with the new base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8888',
});

export const queryService = {
  sendQuery: async (queryText) => {
    try {
      const response = await api.post('/api', { query: queryText });
      return response.data;
    } catch (error) {
      console.error("Error sending query:", error);
      throw error;
    }
  },

  getInsights: async (data) => {
    try {
      const response = await api.post("/insights", { text: data });
      return response.data;
    } catch (error) {
      console.error("Error fetching insights:", error);
      throw error;
    }
  },
};

export default api;
