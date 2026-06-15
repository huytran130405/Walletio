import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constants";

// ── Mock data khởi tạo (offline-first) ────────────────────────────────────────
const MOCK_BUDGETS = [
  { id: "b1", category: "Ăn uống",   limit: 3000000,  period: "monthly", color: "#F59E0B", groupTitle: "🔴 Thiết yếu" },
  { id: "b2", category: "Nhà cửa",   limit: 5000000,  period: "monthly", color: "#3B82F6", groupTitle: "🔴 Thiết yếu" },
  { id: "b3", category: "Di chuyển", limit: 1000000,  period: "monthly", color: "#8B5CF6", groupTitle: "🟠 Di chuyển" },
  { id: "b4", category: "Giải trí",  limit: 500000,   period: "monthly", color: "#EC4899", groupTitle: "🟡 Mong muốn" },
  { id: "b5", category: "Mua sắm",   limit: 1500000,  period: "monthly", color: "#A855F7", groupTitle: "🟡 Mong muốn" },
];

const initialState = {
  budgets: MOCK_BUDGETS,
  status:  "",  // "pending" | "success" | "fail"
};

// ─── Thunks ────────────────────────────────────────────────────────────────

export const fetchBudgets = createAsyncThunk(
  "/budget/fetchBudgets",
  async (_, { getState }) => {
    try {
      const data = await fetch(`${API_BASE_URL}/budgets`).then((res) => res.json());
      return data;
    } catch {
      return getState().budget.budgets;
    }
  }
);

export const createBudget = createAsyncThunk(
  "/budget/createBudget",
  async (budgetData) => {
    try {
      const data = await fetch(`${API_BASE_URL}/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetData),
      }).then((res) => res.json());
      return data;
    } catch {
      return { ...budgetData, id: "b" + Date.now() };
    }
  }
);

export const updateBudget = createAsyncThunk(
  "/budget/updateBudget",
  async ({ id, ...data }) => {
    try {
      const result = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json());
      return result;
    } catch {
      return { id, ...data };
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "/budget/deleteBudget",
  async (budgetId) => {
    try {
      await fetch(`${API_BASE_URL}/budgets/${budgetId}`, { method: "DELETE" });
    } catch {}
    return budgetId;
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

export const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchBudgets
      .addCase(fetchBudgets.pending,   (state) => { state.status = "pending"; })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) state.budgets = action.payload;
        state.status = "success";
      })
      .addCase(fetchBudgets.rejected,  (state) => { state.status = "fail"; })

      // createBudget
      .addCase(createBudget.pending,   (state) => { state.status = "pending"; })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
        state.status = "success";
      })
      .addCase(createBudget.rejected,  (state) => { state.status = "fail"; })

      // updateBudget
      .addCase(updateBudget.pending,   (state) => { state.status = "pending"; })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const idx = state.budgets.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.budgets[idx] = action.payload;
        state.status = "success";
      })
      .addCase(updateBudget.rejected,  (state) => { state.status = "fail"; })

      // deleteBudget
      .addCase(deleteBudget.pending,   (state) => { state.status = "pending"; })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter((b) => b.id !== action.payload);
        state.status  = "success";
      })
      .addCase(deleteBudget.rejected,  (state) => { state.status = "fail"; });
  },
});

// ─── Selectors ─────────────────────────────────────────────────────────────

/** Tổng hạn mức ngân sách */
export const selectTotalBudgetLimit = (state) =>
  state.budget.budgets.reduce((sum, b) => sum + b.limit, 0);

/** Budget summary: gộp với transactions để tính đã chi */
export const selectBudgetSummary = (state, month, year) => {
  const txs = state.transactions.transactions.filter((t) => {
    const [, m, y] = t.date.split("/");
    return parseInt(m) === month && parseInt(y) === year && t.type === "expense";
  });
  return state.budget.budgets.map((b) => {
    const spent = txs
      .filter((t) => t.category === b.category)
      .reduce((s, t) => s + t.amount, 0);
    return { ...b, spent };
  });
};

// ─── Reducer ───────────────────────────────────────────────────────────────

export const budgetReducer = budgetSlice.reducer;
