import { create } from "zustand";

const useAuth = create((set) => ({
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  isAuthenticated: () => !!useAuth.getState().user,
}));

export default useAuth;
