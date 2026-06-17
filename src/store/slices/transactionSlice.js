import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constants";

// ── Mock data khởi tạo (offline-first) ────────────────────────────────────────
const today = new Date();
const fmtDate = (d) => {
  const day   = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year  = d.getFullYear();
  return `${day}/${month}/${year}`;
};
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(today.getDate() - n);
  return d;
};

const MOCK_TRANSACTIONS = [
  { id: "t1", description: "Cà phê sáng",   note: "Cà phê trước giờ học", categoryId: "cat_food", category: "Ăn uống",   amount: 45000,   type: "expense", direction: "out", expense_date: fmtDate(today), date: fmtDate(today),      walletId: "w1", emotionId: "emotion_calm" },
  { id: "t2", description: "Ăn trưa",       note: "Cơm trưa ở căn tin", categoryId: "cat_food", category: "Ăn uống",   amount: 80000,   type: "expense", direction: "out", expense_date: fmtDate(today), date: fmtDate(today),      walletId: "w1", emotionId: "emotion_happy" },
  { id: "t3", description: "Lương tháng",    category: "Lương",     amount: 15000000, type: "income", date: fmtDate(daysAgo(1)), walletId: "w2" },
  { id: "t4", description: "Mua đồ gia dụng", note: "Thêm đồ cho phòng", categoryId: "cat_shopping", category: "Mua sắm",   amount: 450000,  type: "expense", direction: "out", expense_date: fmtDate(daysAgo(1)), date: fmtDate(daysAgo(1)), walletId: "w2", emotionId: "emotion_proud" },
  { id: "t5", description: "Tiền thưởng",    category: "Lương",     amount: 2000000, type: "income",  date: fmtDate(daysAgo(2)), walletId: "w2" },
  { id: "t6", description: "Grab đi làm",    note: "Đi muộn nên gọi xe", categoryId: "cat_transport", category: "Di chuyển", amount: 35000,   type: "expense", direction: "out", expense_date: fmtDate(daysAgo(2)), date: fmtDate(daysAgo(2)), walletId: "w1", emotionId: "emotion_unsure" },
  { id: "t7", description: "Siêu thị",       note: "Đồ ăn cả tuần", categoryId: "cat_shopping", category: "Mua sắm",   amount: 320000,  type: "expense", direction: "out", expense_date: fmtDate(daysAgo(3)), date: fmtDate(daysAgo(3)), walletId: "w1", emotionId: "emotion_calm" },
  { id: "t8", description: "Tiền điện",      note: "Hoá đơn tháng này", categoryId: "cat_home", category: "Nhà cửa",   amount: 580000,  type: "expense", direction: "out", expense_date: fmtDate(daysAgo(5)), date: fmtDate(daysAgo(5)), walletId: "w2", emotionId: "emotion_stressed" },
  { id: "t9", description: "Netflix",        note: "Giải trí cuối tuần", categoryId: "cat_entertainment", category: "Giải trí",  amount: 180000,  type: "expense", direction: "out", expense_date: fmtDate(daysAgo(7)), date: fmtDate(daysAgo(7)), walletId: "w3", emotionId: "emotion_happy" },
  { id: "t10",description: "Khám bệnh",      note: "Kiểm tra sức khoẻ", categoryId: "cat_health", category: "Sức khoẻ",  amount: 200000,  type: "expense", direction: "out", expense_date: fmtDate(daysAgo(8)), date: fmtDate(daysAgo(8)), walletId: "w1", emotionId: "emotion_stressed" },
];

const initialState = {
  transactions: MOCK_TRANSACTIONS,
  status:       "",  // "pending" | "success" | "fail"
};

// ─── Thunks ────────────────────────────────────────────────────────────────

export const fetchTransactions = createAsyncThunk(
  "/transaction/fetchTransactions",
  async (_, { getState }) => {
    try {
      const data = await fetch(`${API_BASE_URL}/transactions`).then((res) => res.json());
      return data;
    } catch {
      // Nếu backend không sẵn, giữ nguyên mock data hiện tại
      return getState().transactions.transactions;
    }
  }
);

export const createTransaction = createAsyncThunk(
  "/transaction/createTransaction",
  async (txData, { rejectWithValue }) => {
    try {
      const data = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txData),
      }).then((res) => res.json());
      return data;
    } catch {
      // Offline fallback: tạo local với ID tạm
      return {
        ...txData,
        id: "t" + Date.now(),
        date: fmtDate(new Date()),
      };
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "/transaction/updateTransaction",
  async ({ id, ...data }, { getState }) => {
    try {
      const result = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json());
      return result;
    } catch {
      // Offline fallback
      return { id, ...data };
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "/transaction/deleteTransaction",
  async (txId) => {
    try {
      await fetch(`${API_BASE_URL}/transactions/${txId}`, { method: "DELETE" });
    } catch {}
    return txId;
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    createTransactionLocal: (state, action) => {
      state.transactions.unshift({
        id: "t" + Date.now(),
        date: fmtDate(new Date()),
        description: action.payload.note || action.payload.category || "Giao dịch",
        ...action.payload,
      });
      state.status = "success";
    },
    updateTransactionLocal: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.transactions.findIndex((transaction) => transaction.id === id);
      if (index !== -1) state.transactions[index] = { ...state.transactions[index], ...updates };
      state.status = "success";
    },
    deleteTransactionLocal: (state, action) => {
      state.transactions = state.transactions.filter((transaction) => transaction.id !== action.payload);
      state.status = "success";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTransactions
      .addCase(fetchTransactions.pending,   (state) => { state.status = "pending"; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.transactions = action.payload;
        }
        state.status = "success";
      })
      .addCase(fetchTransactions.rejected,  (state) => { state.status = "fail"; })

      // createTransaction
      .addCase(createTransaction.pending,   (state) => { state.status = "pending"; })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        state.status = "success";
      })
      .addCase(createTransaction.rejected,  (state) => { state.status = "fail"; })

      // updateTransaction
      .addCase(updateTransaction.pending,   (state) => { state.status = "pending"; })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const idx = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.transactions[idx] = action.payload;
        state.status = "success";
      })
      .addCase(updateTransaction.rejected,  (state) => { state.status = "fail"; })

      // deleteTransaction
      .addCase(deleteTransaction.pending,   (state) => { state.status = "pending"; })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
        state.status       = "success";
      })
      .addCase(deleteTransaction.rejected,  (state) => { state.status = "fail"; });
  },
});

// ─── Selectors ─────────────────────────────────────────────────────────────

/** Lọc transactions theo tháng/năm */
export const selectTransactionsByMonth = (state, month, year) =>
  state.transactions.transactions.filter((t) => {
    const [d, m, y] = t.date.split("/");
    return parseInt(m) === month && parseInt(y) === year;
  });

/** Tổng thu/chi trong tháng */
export const selectMonthlySummary = (state, month, year) => {
  const txs = selectTransactionsByMonth(state, month, year);
  const income  = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, net: income - expense };
};

/** Group transactions by category (chi tiêu) trong tháng */
export const selectExpenseByCategory = (state, month, year) => {
  const txs = selectTransactionsByMonth(state, month, year).filter((t) => t.type === "expense");
  const map = {};
  txs.forEach((t) => {
    if (!map[t.category]) map[t.category] = 0;
    map[t.category] += t.amount;
  });
  return Object.entries(map).map(([name, amount]) => ({ name, amount }));
};

// ─── Reducer ───────────────────────────────────────────────────────────────

export const { createTransactionLocal, updateTransactionLocal, deleteTransactionLocal } = transactionSlice.actions;
export const transactionReducer = transactionSlice.reducer;
