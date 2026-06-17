import { createSlice } from "@reduxjs/toolkit";

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
};

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.categories.push({
        id: "cat_" + Date.now(),
        type: "expense",
        icon: "apps-outline",
        color: "#2F7D5A",
        groupId: "group_other",
        ...action.payload,
      });
    },
    updateCategory: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.categories.findIndex((category) => category.id === id);
      if (index !== -1) state.categories[index] = { ...state.categories[index], ...updates };
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
