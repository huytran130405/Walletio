// ─── API Base URL ───────────────────────────────────────────────────────────
// TODO: Cập nhật URL backend khi hoàn thiện
export const API_BASE_URL = "http://localhost:3000";

// ─── Screen Names ───────────────────────────────────────────────────────────
export const SCREENS = {
  MAIN_TABS:          "MainTabs",
  DASHBOARD:          "Dashboard",
  TRANSACTIONS:       "Transactions",
  CREATE_TRANSACTION: "CreateTransaction",
  ANALYTIC:           "Analytic",
  MY_WALLETS:         "MyWallets",
  BUDGET_PLANNING:    "BudgetPlanning",
  ACCOUNT_SETTINGS:   "AccountSettings",
};

// ─── Transaction Categories ─────────────────────────────────────────────────
export const CATEGORIES = [
  "Ăn uống",
  "Di chuyển",
  "Mua sắm",
  "Giải trí",
  "Sức khoẻ",
  "Giáo dục",
  "Nhà ở",
  "Khác",
];

// ─── Transaction Types ──────────────────────────────────────────────────────
export const TRANSACTION_TYPES = {
  INCOME:  "income",
  EXPENSE: "expense",
};
