import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { API_ENDPOINTS } from "../components/config/api";

const initialState = {
  user: null,
  token: null,
};

const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (user, token) => set({ user, token }),
      logout: () => {
        set({ ...initialState });
        localStorage.removeItem("auth-storage");
        sessionStorage.removeItem("auth-storage");
      },
      reset: () => {
        set({ ...initialState });
        localStorage.removeItem("auth-storage");
        sessionStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export const useAuth = () => {
  const { user, token, setAuth, reset } = useAuthStore();

  const login = async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.auth.login, {
        email,
        password,
      });
      const { user, token } = response.data;
      setAuth(user, token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.auth.register, {
        username,
        email,
        password,
      });
      const { user, token } = response.data;
      setAuth(user, token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post(API_ENDPOINTS.auth.logout, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      if (error.response?.status === 401) {
        reset();
        window.location.href = "/login";
        window.location.reload();
      }
    }
    reset();
    window.location.href = "/login";
    window.location.reload();
  };

  return {
    user,
    token,
    login,
    register,
    logout: handleLogout,
    isAuthenticated: !!token,
  };
};

export { useAuthStore };
