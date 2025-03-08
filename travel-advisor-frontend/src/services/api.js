// src/services/api.js
import axios from 'axios';

// Create a base API instance with shared configuration
const api = axios.create({
  // Define the base URL for all API requests
  // In development, this would point to your local Spring Boot server
  baseURL: 'http://localhost:8080/api',
  
  // Set default headers for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Set a timeout (in milliseconds) for requests
  timeout: 10000
});

// Add a request interceptor
api.interceptors.request.use(
  config => {
    // Get the token from local storage (if we implement authentication later)
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    // Handle request errors
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    // Return the response data directly
    return response.data;
  },
  error => {
    // Handle different response error scenarios
    const { response } = error;
    
    // Create a standardized error object
    let errorMessage = 'An unexpected error occurred';
    let errorStatus = 500;
    
    if (response) {
      // The request was made and the server responded with an error status
      errorStatus = response.status;
      
      // Use the server's error message if available
      errorMessage = response.data?.message || `Error: ${response.status} ${response.statusText}`;
      
      // Handle specific status codes
      if (response.status === 401) {
        // Unauthorized - handle authentication issues
        console.log('Authentication error - you might need to log in again');
        // Clear storage and redirect to login (when we implement auth)
        // localStorage.removeItem('token');
        // window.location = '/login';
      } else if (response.status === 403) {
        // Forbidden - handle permission issues
        errorMessage = 'You do not have permission to perform this action';
      } else if (response.status === 404) {
        // Not found
        errorMessage = 'The requested resource was not found';
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server. Please check your internet connection.';
    }
    
    // Create a standardized error object
    // Create a standardized error object with only serializable properties
const enhancedError = {
  message: errorMessage,
  status: errorStatus,
  originalMessage: error.message, // Only take the message, not the entire error object
  timestamp: new Date().toISOString() // Convert to string for better logging
};

  console.error('API response error:', enhancedError);

    // Return a rejected promise with our enhanced error
    return Promise.reject(enhancedError);
  }
);

export default api;