import { fetchAPI } from "./api";

export const walletService = {
  getAll: () => fetchAPI("/wallets"),
  getById: (id) => fetchAPI(`/wallets/${id}`),
  create: (data) =>
    fetchAPI("/wallets", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/wallets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => fetchAPI(`/wallets/${id}`, { method: "DELETE" }),
};
