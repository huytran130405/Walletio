import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { categoryService } from "../../services/categoryService";

const DEFAULT_CATEGORIES = [
  { id: "cat_food", name: "Ăn uống", type: "expense", icon: "restaurant-outline", color: "#D8A85B", groupId: "group_essentials" },
  { id: "cat_transport", name: "Di chuyển", type: "expense", icon: "car-outline", color: "#4E93B6", groupId: "group_mobility" },
  { id: "cat_shopping", name: "Mua sắm", type: "expense", icon: "bag-outline", color: "#A855F7", groupId: "group_wants" },
  { id: "cat_entertainment", name: "Giải trí", type: "expense", icon: "game-controller-outline", color: "#C78365", groupId: "group_wants" },
  { id: "cat_health", name: "Sức khoẻ", type: "expense", icon: "medkit-outline", color: "#2F9E69", groupId: "group_essentials" },
  { id: "cat_education", name: "Giáo dục", type: "expense", icon: "school-outline", color: "#3F7891", groupId: "group_growth" },
  { id: "cat_home", name: "Nhà cửa", type: "expense", icon: "home-outline", color: "#8FBF8F", groupId: "group_essentials" },
  { id: "cat_salary", name: "Lương", type: "income", icon: "briefcase-outline", color: "#2F9E69", groupId: "group_income" },
  { id: "cat_bonus", name: "Thưởng", type: "income", icon: "gift-outline", color: "#D69E2E", groupId: "group_income" },
  { id: "cat_other", name: "Khác", type: "expense", icon: "apps-outline", color: "#8B6A4E", groupId: "group_other" },
];

const initialState = {
  categories: DEFAULT_CATEGORIES,
  status: "",
  error: null,
};

const fallbackVisual = (index = 0) => DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length];

const parseCategoryMeta = (icon) => {
  if (!icon) return {};
  try {
    const meta = JSON.parse(icon);
    return meta && typeof meta === "object" ? meta : { icon };
  } catch {
    return { icon };
  }
};

const normalizeCategory = (category = {}, index = 0, fallback = {}) => {
  const visual = fallbackVisual(index);
  const meta = parseCategoryMeta(category.icon);
  return {
    id: category.id ?? fallback.id,
    userId: category.user_id ?? fallback.userId,
    name: category.name ?? fallback.name ?? "Khác",
    type: meta.type ?? fallback.type ?? "expense",
    icon: meta.icon ?? fallback.icon ?? visual.icon ?? "apps-outline",
    color: meta.color ?? fallback.color ?? visual.color ?? "#2F7D5A",
    groupId: meta.groupId ?? fallback.groupId ?? "group_other",
  };
};

const toCategoryPayload = (category = {}) => ({
  name: category.name,
  icon: JSON.stringify({
    icon: category.icon ?? "apps-outline",
    type: category.type ?? "expense",
    color: category.color ?? "#2F7D5A",
    groupId: category.groupId ?? "group_other",
  }),
});

export const fetchCategories = createAsyncThunk(
  "/categories/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Bạn cần đăng nhập lại.");
      const data = await categoryService.getAll(token);
      return Array.isArray(data) ? data.map(normalizeCategory) : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addCategory = createAsyncThunk(
  "/categories/addCategory",
  async (category, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Bạn cần đăng nhập lại.");
      const data = await categoryService.create(token, toCategoryPayload(category));
      return normalizeCategory(data?.data ?? data, 0, category);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateCategory = createAsyncThunk(
  "/categories/updateCategory",
  async ({ id, ...updates }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Bạn cần đăng nhập lại.");
      const data = await categoryService.update(token, id, toCategoryPayload(updates));
      return normalizeCategory(data?.data ?? data, 0, { id, ...updates });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "/categories/deleteCategory",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Bạn cần đăng nhập lại.");
      await categoryService.delete(token, id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategoryLocal: (state, action) => {
      state.categories.push({
        id: "cat_" + Date.now(),
        type: "expense",
        icon: "apps-outline",
        color: "#2F7D5A",
        groupId: "group_other",
        ...action.payload,
      });
    },
    updateCategoryLocal: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.categories.findIndex((category) => category.id === id);
      if (index !== -1) state.categories[index] = { ...state.categories[index], ...updates };
    },
    deleteCategoryLocal: (state, action) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.length ? action.payload : DEFAULT_CATEGORIES;
        state.status = "success";
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload ?? action.error.message;
      })
      .addCase(addCategory.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.status = "success";
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload ?? action.error.message;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id === action.payload.id);
        if (index !== -1) state.categories[index] = { ...state.categories[index], ...action.payload };
        state.status = "success";
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload ?? action.error.message;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category.id !== action.payload);
        state.status = "success";
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { addCategoryLocal, updateCategoryLocal, deleteCategoryLocal } =
  categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
