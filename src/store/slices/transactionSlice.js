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
  { id: "t1", description: "Cà phê sáng",   category: "Ăn uống",   amount: 45000,   type: "expense", date: fmtDate(today),      walletId: "w1" },
  { id: "t2", description: "Ăn trưa",       category: "Ăn uống",   amount: 80000,   type: "expense", date: fmtDate(today),      walletId: "w1" },
  { id: "t3", description: "Lương tháng",    category: "Lương",     amount: 15000000, type: "income", date: fmtDate(daysAgo(1)), walletId: "w2" },
  { id: "t4", description: "Mua đồ gia dụng",category: "Mua sắm",   amount: 450000,  type: "expense", date: fmtDate(daysAgo(1)), walletId: "w2" },
  { id: "t5", description: "Tiền thưởng",    category: "Lương",     amount: 2000000, type: "income",  date: fmtDate(daysAgo(2)), walletId: "w2" },
  { id: "t6", description: "Grab đi làm",    category: "Di chuyển", amount: 35000,   type: "expense", date: fmtDate(daysAgo(2)), walletId: "w1" },
  { id: "t7", description: "Siêu thị",       category: "Mua sắm",   amount: 320000,  type: "expense", date: fmtDate(daysAgo(3)), walletId: "w1" },
  { id: "t8", description: "Tiền điện",      category: "Nhà cửa",   amount: 580000,  type: "expense", date: fmtDate(daysAgo(5)), walletId: "w2" },
  { id: "t9", description: "Netflix",        category: "Giải trí",  amount: 180000,  type: "expense", date: fmtDate(daysAgo(7)), walletId: "w3" },
  { id: "t10",description: "Khám bệnh",      category: "Sức khoẻ",  amount: 200000,  type: "expense", date: fmtDate(daysAgo(8)), walletId: "w1" },
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
  reducers: {},
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

export const transactionReducer = transactionSlice.reducer;
