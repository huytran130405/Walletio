import { createSlice } from "@reduxjs/toolkit";

const today = new Date();
const fmtDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const initialState = {
  transfers: [
    {
      id: "tr1",
      fromId: "w2",
      toId: "w1",
      amount: 750000,
      date: fmtDate(today),
      note: "Rút tiền chi tiêu tuần này",
    },
  ],
};

export const transferSlice = createSlice({
  name: "transfers",
  initialState,
  reducers: {
    addTransfer: (state, action) => {
      state.transfers.unshift({
        id: "tr_" + Date.now(),
        date: fmtDate(new Date()),
        note: "",
        ...action.payload,
      });
    },
    deleteTransfer: (state, action) => {
      state.transfers = state.transfers.filter((transfer) => transfer.id !== action.payload);
    },
  },
});

export const { addTransfer, deleteTransfer } = transferSlice.actions;
export const transferReducer = transferSlice.reducer;
