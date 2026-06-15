import { API_BASE_URL } from "../utils/constants";

/**
 * Generic fetch wrapper
 * @param {string} endpoint - relative path e.g. "/wallets"
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = { "Content-Type": "application/json" };

  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};
