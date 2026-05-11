// services/api.client.js
import config from '../config/api.config';

export class ApiClient {
  constructor() {
    this.baseURL = config.baseURL;
  }

  // Helper method for GET requests
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: config.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  // Helper method for POST requests
  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  // Helper method for PUT requests
  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: config.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  // Helper method for DELETE requests
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: config.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }

  // Special method for multipart/form-data (file uploads)
  async upload(endpoint, formData) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}

export default new ApiClient();