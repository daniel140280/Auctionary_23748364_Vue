import { defineStore } from "pinia";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("session_token") || null,
    isAuthenticated: !!localStorage.getItem("session_token"),
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;

        localStorage.setItem("session_token", response.data.token);

        // Set default authorization header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);

        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;

        localStorage.setItem("session_token", response.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || "Registration failed";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrentUser() {
      if (!this.token) return;

      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = response.data.user;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("session_token");
      delete axios.defaults.headers.common["Authorization"];
    },

    initAuth() {
      const token = localStorage.getItem("session_token");
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        this.fetchCurrentUser();
      }
    },
  },
});