import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constants";

// ── Mock data khởi tạo (offline-first) ────────────────────────────────────────
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

const MOCK_MONTHLY_BUDGETS = [
  { id: `mb_${currentYear}_${currentMonth}`, month: currentMonth, year: currentYear, amount: 15000000 },
];

const MOCK_BUDGETS = [
  {
    id: "b1",
    categoryId: "cat_food",
    category: "Ăn uống",
    groupId: "group_essentials",
    groupTitle: "Thiết yếu",
    limit: 3000000,
    month: currentMonth,
    year: currentYear,
    period: "monthly",
    color: "#D8A85B",
  },
  {
    id: "b2",
    categoryId: "cat_home",
    category: "Nhà cửa",
    groupId: "group_essentials",
    groupTitle: "Thiết yếu",
    limit: 5000000,
    month: currentMonth,
    year: currentYear,
    period: "monthly",
    color: "#8FBF8F",
  },
  {
    id: "b3",
    categoryId: "cat_transport",
    category: "Di chuyển",
    groupId: "group_mobility",
    groupTitle: "Di chuyển",
    limit: 1000000,
    month: currentMonth,
    year: currentYear,
    period: "monthly",
    color: "#4E93B6",
  },
  {
    id: "b4",
    categoryId: "cat_entertainment",
    category: "Giải trí",
    groupId: "group_wants",
    groupTitle: "Mong muốn",
    limit: 500000,
    month: currentMonth,
    year: currentYear,
    period: "monthly",
    color: "#C78365",
  },
  {
    id: "b5",
    categoryId: "cat_shopping",
    category: "Mua sắm",
    groupId: "group_wants",
    groupTitle: "Mong muốn",
    limit: 1500000,
    month: currentMonth,
    year: currentYear,
    period: "monthly",
    color: "#A855F7",
  },
];

const initialState = {
  budgets: MOCK_BUDGETS,
  monthlyBudgets: MOCK_MONTHLY_BUDGETS,
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
  reducers: {
    setMonthlyBudgetLocal: (state, action) => {
      const { month, year, amount } = action.payload;
      const index = state.monthlyBudgets.findIndex(
        (budget) => budget.month === month && budget.year === year,
      );
      if (index !== -1) {
        state.monthlyBudgets[index].amount = amount;
      } else {
        state.monthlyBudgets.push({
          id: `mb_${year}_${month}_${Date.now()}`,
          month,
          year,
          amount,
        });
      }
      state.status = "success";
    },
    createBudgetLocal: (state, action) => {
      const budget = {
        id: "b" + Date.now(),
        period: "monthly",
        color: "#2F7D5A",
        month: currentMonth,
        year: currentYear,
        ...action.payload,
      };
      const existingIndex = state.budgets.findIndex((item) => {
        if (!item.categoryId || !budget.categoryId) return false;
        return (
          item.categoryId === budget.categoryId &&
          item.month === budget.month &&
          item.year === budget.year
        );
      });
      if (existingIndex !== -1) {
        state.budgets[existingIndex] = {
          ...state.budgets[existingIndex],
          ...budget,
          id: state.budgets[existingIndex].id,
        };
      } else {
        state.budgets.push(budget);
      }
      state.status = "success";
    },
    updateBudgetLocal: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.budgets.findIndex((budget) => budget.id === id);
      if (index !== -1) state.budgets[index] = { ...state.budgets[index], ...updates };
      state.status = "success";
    },
    deleteBudgetLocal: (state, action) => {
      state.budgets = state.budgets.filter((budget) => budget.id !== action.payload);
      state.status = "success";
    },
  },
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
export const selectTotalBudgetLimit = (state, month, year) => {
  const fallbackDate = new Date();
  const targetMonth = month ?? fallbackDate.getMonth() + 1;
  const targetYear = year ?? fallbackDate.getFullYear();
  return state.budget.budgets
    .filter((budget) => {
      const budgetMonth = budget.month ?? targetMonth;
      const budgetYear = budget.year ?? targetYear;
      return budgetMonth === targetMonth && budgetYear === targetYear;
    })
    .reduce((sum, budget) => sum + budget.limit, 0);
};

/** Ngân sách tổng theo tháng */
export const selectMonthlyBudget = (state, month, year) => {
  const monthlyBudgets = state.budget.monthlyBudgets ?? [];
  const monthlyBudget = monthlyBudgets.find(
    (budget) => budget.month === month && budget.year === year,
  );
  return monthlyBudget ?? { id: null, month, year, amount: 0 };
};

/** Budget summary: gộp với transactions để tính đã chi */
export const selectBudgetSummary = (state, month, year) => {
  const txs = state.transactions.transactions.filter((t) => {
    const [, m, y] = t.date.split("/");
    return parseInt(m) === month && parseInt(y) === year && t.type === "expense";
  });
  const categories = state.categories?.categories ?? [];
  const groups = state.spendingGroups?.groups ?? [];
  return state.budget.budgets
    .filter((b) => {
      const budgetMonth = b.month ?? month;
      const budgetYear = b.year ?? year;
      return budgetMonth === month && budgetYear === year;
    })
    .map((b) => {
    const category = categories.find((item) => item.id === b.categoryId);
    const group = groups.find((item) => item.id === (b.groupId ?? category?.groupId));
    const categoryName = category?.name ?? b.category;
    const spent = txs
      .filter((t) => t.categoryId === b.categoryId || t.category === categoryName)
      .reduce((s, t) => s + t.amount, 0);
    return {
      ...b,
      category: categoryName,
      categoryId: b.categoryId ?? category?.id,
      groupId: b.groupId ?? category?.groupId,
      groupTitle: group?.title ?? b.groupTitle ?? "Khác",
      groupColor: group?.color,
      icon: category?.icon,
      color: b.color ?? category?.color,
      spent,
      remaining: (b.limit ?? 0) - spent,
    };
  });
};

// ─── Reducer ───────────────────────────────────────────────────────────────

export const {
  createBudgetLocal,
  updateBudgetLocal,
  deleteBudgetLocal,
  setMonthlyBudgetLocal,
} = budgetSlice.actions;
export const budgetReducer = budgetSlice.reducer;
