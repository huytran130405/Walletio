import { fetchAPI } from "./api";

export const authService = {
  login: (credentials) =>
    fetchAPI("/auth/login", { method: "POST", body: credentials }),
  register: (userData) =>
    fetchAPI("/auth/signup", { method: "POST", body: userData }),
  getProfile: (token) => fetchAPI("/profile", { token }),
  updateProfile: (token, profileData) =>
    fetchAPI("/profile", { method: "PATCH", token, body: profileData }),
  changePassword: (token, data) =>
    fetchAPI("/auth/password", { method: "PUT", token, body: data }),
};
