import { useSelector, useDispatch } from "react-redux";
import { loginLocal, logoutLocal } from "../store/slices/authSlice";

/**
 * Custom hook for auth state & actions
 * Usage: const { user, token, status, login, logout } = useAuth();
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, status } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginLocal(credentials));
  const logout = () => dispatch(logoutLocal());

  return { user, token, status, login, logout };
};
