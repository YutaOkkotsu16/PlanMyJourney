// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for handling API calls with loading, error, and data states
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies that trigger the API call when changed
 * @param {boolean} immediate - Whether to call the API immediately
 * @param {Array} initialArgs - Initial arguments for the API call
 * @returns {Object} Object containing loading state, error, data, and execute function
 */
const useApi = (apiFunction, dependencies = [], immediate = false, initialArgs = []) => {
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // The execute function calls the API and manages state
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // Call the API immediately if requested
  useEffect(() => {
    if (immediate) {
      execute(...initialArgs);
    }
  }, [...dependencies, execute]);

  return { loading, error, data, execute };
};

export default useApi;