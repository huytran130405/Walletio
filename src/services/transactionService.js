import { fetchAPI } from "./api";

export const transactionService = {
  getAll:  ()         => fetchAPI("/transactions"),
  getById: (id)       => fetchAPI(`/transactions/${id}`),
  create:  (data)     => fetchAPI("/transactions", { method: "POST",   body: JSON.stringify(data) }),
  update:  (id, data) => fetchAPI(`/transactions/${id}`, { method: "PUT",    body: JSON.stringify(data) }),
  remove:  (id)       => fetchAPI(`/transactions/${id}`, { method: "DELETE" }),
};
