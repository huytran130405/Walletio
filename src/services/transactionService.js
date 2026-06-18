import { fetchAPI } from "./api";

export const transactionService = {
  getAll: (token) => fetchAPI("/expenses", { token }),
  create: (token, data) =>
    fetchAPI("/expenses", { method: "POST", token, body: data }),
  update: (token, id, data) =>
    fetchAPI(`/expenses/${id}`, {
      method: "PATCH",
      token,
      body: data,
    }),
};
