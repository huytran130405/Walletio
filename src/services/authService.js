import { fetchAPI } from "./api";

export const authService = {
  login: (credentials) =>
    fetchAPI("/login", { method: "POST", body: JSON.stringify(credentials) }),
  logout: () => fetchAPI("/logout", { method: "POST" }),
  register: (userData) =>
    fetchAPI("/register", { method: "POST", body: JSON.stringify(userData) }),
  getMe: () => fetchAPI("/me"),
};
