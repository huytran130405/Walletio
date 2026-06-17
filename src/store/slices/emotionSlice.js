import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_EMOTIONS = [
  { id: "emotion_happy", label: "Vui vẻ", score: "+2", icon: "happy-outline", color: "#2F9E69" },
  { id: "emotion_calm", label: "Bình tĩnh", score: "+1", icon: "leaf-outline", color: "#4E93B6" },
  { id: "emotion_proud", label: "Tự hào", score: "+2", icon: "sparkles-outline", color: "#D8A85B" },
  { id: "emotion_unsure", label: "Lăn tăn", score: "-1", icon: "help-circle-outline", color: "#8B6A4E" },
  { id: "emotion_stressed", label: "Áp lực", score: "-2", icon: "flash-outline", color: "#D85C4A" },
];

const initialState = {
  emotions: DEFAULT_EMOTIONS,
};

export const emotionSlice = createSlice({
  name: "emotions",
  initialState,
  reducers: {},
});

export const emotionReducer = emotionSlice.reducer;
