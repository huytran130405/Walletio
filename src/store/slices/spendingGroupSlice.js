import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_GROUPS = [
  { id: "group_essentials", title: "Thiết yếu", icon: "shield-checkmark-outline", color: "#D85C4A" },
  { id: "group_mobility", title: "Di chuyển", icon: "navigate-outline", color: "#4E93B6" },
  { id: "group_wants", title: "Mong muốn", icon: "sparkles-outline", color: "#D8A85B" },
  { id: "group_growth", title: "Phát triển", icon: "school-outline", color: "#2F9E69" },
  { id: "group_income", title: "Thu nhập", icon: "trending-up-outline", color: "#2F9E69" },
  { id: "group_other", title: "Khác", icon: "albums-outline", color: "#8B6A4E" },
];

const initialState = {
  groups: DEFAULT_GROUPS,
};

export const spendingGroupSlice = createSlice({
  name: "spendingGroups",
  initialState,
  reducers: {
    addSpendingGroup: (state, action) => {
      state.groups.push({
        id: "group_" + Date.now(),
        icon: "albums-outline",
        color: "#2F7D5A",
        ...action.payload,
      });
    },
    updateSpendingGroup: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.groups.findIndex((group) => group.id === id);
      if (index !== -1) state.groups[index] = { ...state.groups[index], ...updates };
    },
    deleteSpendingGroup: (state, action) => {
      state.groups = state.groups.filter((group) => group.id !== action.payload);
    },
  },
});

export const { addSpendingGroup, updateSpendingGroup, deleteSpendingGroup } = spendingGroupSlice.actions;
export const spendingGroupReducer = spendingGroupSlice.reducer;
