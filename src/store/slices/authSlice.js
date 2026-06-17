import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constants";

// ── Mock user mặc định ────────────────────────────────────────────────────────
const MOCK_USER = {
  id:    "u1",
  name:  "Minh Nhật",
  email: "minhnhat@walletio.app",
  avatar: null,
};

const initialState = {
  user:   null,
  token:  null,
  status: "",         // "pending" | "success" | "fail"
};

// ─── Thunks ────────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  "/auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }).then((res) => res.json());
      return data;
    } catch {
      // Offline fallback: mock login thành công
      return { user: MOCK_USER, token: "mock-token" };
    }
  }
);

export const registerUser = createAsyncThunk(
  "/auth/registerUser",
  async ({ name, email, password }) => {
    try {
      const data = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      }).then((res) => res.json());
      return data;
    } catch {
      return { user: { ...MOCK_USER, name, email }, token: "mock-token" };
    }
  }
);

export const updateProfile = createAsyncThunk(
  "/auth/updateProfile",
  async (profileData, { getState }) => {
    try {
      const { token } = getState().auth;
      const data = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileData),
      }).then((res) => res.json());
      return data;
    } catch {
      return { ...getState().auth.user, ...profileData };
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logoutUser",
  async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, { method: "POST" });
    } catch {}
    return null;
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginLocal: (state, action) => {
      const { email, name } = action.payload;
      state.user = {
        ...MOCK_USER,
        email,
        name: name || email?.split("@")[0] || MOCK_USER.name,
      };
      state.token = "mock-token";
      state.status = "success";
    },
    registerLocal: (state, action) => {
      const { name, email } = action.payload;
      state.user = {
        ...MOCK_USER,
        id: "u_" + Date.now(),
        name,
        email,
      };
      state.token = "mock-token";
      state.status = "success";
    },
    updateProfileLocal: (state, action) => {
      state.user = { ...(state.user || MOCK_USER), ...action.payload };
      state.status = "success";
    },
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.status = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending,   (state) => { state.status = "pending"; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user   = action.payload.user;
        state.token  = action.payload.token;
      })
      .addCase(loginUser.rejected,  (state) => { state.status = "fail"; })

      // registerUser
      .addCase(registerUser.pending,   (state) => { state.status = "pending"; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user   = action.payload.user;
        state.token  = action.payload.token;
      })
      .addCase(registerUser.rejected,  (state) => { state.status = "fail"; })

      // updateProfile
      .addCase(updateProfile.pending,   (state) => { state.status = "pending"; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user   = action.payload;
        state.status = "success";
      })
      .addCase(updateProfile.rejected,  (state) => { state.status = "fail"; })

      // logoutUser
      .addCase(logoutUser.pending,   (state) => { state.status = "pending"; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user   = null;
        state.token  = null;
        state.status = "";
      })
      .addCase(logoutUser.rejected,  (state) => { state.status = "fail"; });
  },
});

// ─── Reducer ───────────────────────────────────────────────────────────────

export const { loginLocal, registerLocal, updateProfileLocal, logoutLocal } = authSlice.actions;
export const authReducer = authSlice.reducer;
