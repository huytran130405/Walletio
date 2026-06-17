import { useSelector, useDispatch } from "react-redux";
import {
  createTransactionLocal,
  deleteTransactionLocal,
} from "../store/slices/transactionSlice";

/**
 * Custom hook for transaction state & actions
 * Usage: const { transactions, status, loadAll, add, remove } = useTransaction();
 */
export const useTransaction = () => {
  const dispatch = useDispatch();
  const { transactions, status } = useSelector((state) => state.transactions);

  const loadAll = () => Promise.resolve(transactions);
  const add = (data) => dispatch(createTransactionLocal(data));
  const remove = (id) => dispatch(deleteTransactionLocal(id));

  return { transactions, status, loadAll, add, remove };
};
