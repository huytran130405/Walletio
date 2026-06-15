import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constants";

// ── Mock data khởi tạo (offline-first) ────────────────────────────────────────
const MOCK_WALLETS = [
  { id: "w1", name: "Tiền mặt",            balance: 2000000,  type: "cash",   color: "#22C55E" },
  { id: "w2", name: "Tài khoản ngân hàng", balance: 10000000, type: "bank",   color: "#3B82F6" },
  { id: "w3", name: "Ví điện tử",          balance: 3500000,  type: "ewallet",color: "#A855F7" },
];

const initialState = {
  wallets: MOCK_WALLETS,
  status:  "",  // "pending" | "success" | "fail"
};

// ─── Thunks ────────────────────────────────────────────────────────────────

export const fetchWallets = createAsyncThunk(
  "/wallet/fetchWallets",
  async (_, { getState }) => {
    try {
      const data = await fetch(`${API_BASE_URL}/wallets`).then((res) => res.json());
      return data;
    } catch {
      return getState().wallets.wallets;
    }
  }
);

export const addWallet = createAsyncThunk(
  "/wallet/addWallet",
  async (walletData) => {
    try {
      const data = await fetch(`${API_BASE_URL}/wallets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(walletData),
      }).then((res) => res.json());
      return data;
    } catch {
      return { ...walletData, id: "w" + Date.now() };
    }
  }
);

export const updateWallet = createAsyncThunk(
  "/wallet/updateWallet",
  async ({ id, ...data }) => {
    try {
      const result = await fetch(`${API_BASE_URL}/wallets/${id}`, {
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

export const deleteWallet = createAsyncThunk(
  "/wallet/deleteWallet",
  async (walletId) => {
    try {
      await fetch(`${API_BASE_URL}/wallets/${walletId}`, { method: "DELETE" });
    } catch {}
    return walletId;
  }
);

export const transferBetweenWallets = createAsyncThunk(
  "/wallet/transfer",
  async ({ fromId, toId, amount }, { getState }) => {
    const wallets = getState().wallets.wallets;
    const from = wallets.find((w) => w.id === fromId);
    const to   = wallets.find((w) => w.id === toId);
    if (!from || !to || from.balance < amount) throw new Error("Không đủ số dư");
    try {
      await fetch(`${API_BASE_URL}/wallets/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromId, toId, amount }),
      });
    } catch {}
    // Offline: cập nhật local state
    return { fromId, toId, amount };
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchWallets
      .addCase(fetchWallets.pending,   (state) => { state.status = "pending"; })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) state.wallets = action.payload;
        state.status = "success";
      })
      .addCase(fetchWallets.rejected,  (state) => { state.status = "fail"; })

      // addWallet
      .addCase(addWallet.pending,   (state) => { state.status = "pending"; })
      .addCase(addWallet.fulfilled, (state, action) => {
        state.wallets.push(action.payload);
        state.status = "success";
      })
      .addCase(addWallet.rejected,  (state) => { state.status = "fail"; })

      // updateWallet
      .addCase(updateWallet.pending,   (state) => { state.status = "pending"; })
      .addCase(updateWallet.fulfilled, (state, action) => {
        const idx = state.wallets.findIndex((w) => w.id === action.payload.id);
        if (idx !== -1) state.wallets[idx] = action.payload;
        state.status = "success";
      })
      .addCase(updateWallet.rejected,  (state) => { state.status = "fail"; })

      // deleteWallet
      .addCase(deleteWallet.pending,   (state) => { state.status = "pending"; })
      .addCase(deleteWallet.fulfilled, (state, action) => {
        state.wallets = state.wallets.filter((w) => w.id !== action.payload);
        state.status  = "success";
      })
      .addCase(deleteWallet.rejected,  (state) => { state.status = "fail"; })

      // transferBetweenWallets
      .addCase(transferBetweenWallets.pending,   (state) => { state.status = "pending"; })
      .addCase(transferBetweenWallets.fulfilled, (state, action) => {
        const { fromId, toId, amount } = action.payload;
        const from = state.wallets.find((w) => w.id === fromId);
        const to   = state.wallets.find((w) => w.id === toId);
        if (from) from.balance -= amount;
        if (to)   to.balance   += amount;
        state.status = "success";
      })
      .addCase(transferBetweenWallets.rejected,  (state) => { state.status = "fail"; });
  },
});

// ─── Selectors ─────────────────────────────────────────────────────────────

export const selectTotalBalance = (state) =>
  state.wallets.wallets.reduce((sum, w) => sum + w.balance, 0);

// ─── Reducer ───────────────────────────────────────────────────────────────

export const walletReducer = walletSlice.reducer;
