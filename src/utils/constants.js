import { Platform } from "react-native";

// ─── API Base URL ───────────────────────────────────────────────────────────
const DEV_API_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? `http://${DEV_API_HOST}:3000/api`;

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
