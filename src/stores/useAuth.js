import { create } from "zustand";
import API from "../api/axios";

const useAuth = create((set) => ({
  user: null,
  token: null,
  login: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
  isAuthenticated: () => !!useAuth.getState().user,
  autoLogin: async () => {
    try {
      const verifyRes = await API.get("/auth/verify");
      const { id } = verifyRes.data.user;

      // ✅ Fetch full user info using ID
      const profileRes = await API.get(`/auth/users/${id}`);
      const fullUser = profileRes.data;

      set({ user: fullUser });
      // console.log("✅ Auto login complete:", fullUser);
    } catch (err) {
      // console.log("Not logged in");
      set({ user: null });
    }
  },
}));

export default useAuth;
