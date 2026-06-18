import { fetchAPI } from "./api";

export const walletService = {
  getAll: (token) => fetchAPI("/wallets", { token }),
  getSummary: (token) => fetchAPI("/wallets/summary", { token }),
};
