import { configureStore } from "@reduxjs/toolkit";
import { authReducer }        from "./slices/authSlice";
import { walletReducer }      from "./slices/walletSlice";
import { transactionReducer } from "./slices/transactionSlice";
import { budgetReducer }      from "./slices/budgetSlice";
import { categoryReducer }    from "./slices/categorySlice";
import { emotionReducer }     from "./slices/emotionSlice";
import { transferReducer }    from "./slices/transferSlice";

export const mystore = configureStore({
  reducer: {
    auth: authReducer,
    wallets: walletReducer,
    transactions: transactionReducer,
    budget: budgetReducer,
    categories: categoryReducer,
    emotions: emotionReducer,
    transfers: transferReducer,
  },
});
