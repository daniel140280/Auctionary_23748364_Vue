import { defineStore } from "pinia";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const useItemsStore = defineStore("items", {
  state: () => ({
    items: [],
    featuredItems: [],
    userItems: [],
    currentItem: null,
    loading: false,
    error: null,
    filters: {
      category: "",
      minPrice: null,
      maxPrice: null,
      searchQuery: "",
    },
  }),

  getters: {
    filteredItems: (state) => {
      let filtered = state.items;

      if (state.filters.category) {
        filtered = filtered.filter(
          (item) => item.category === state.filters.category
        );
      }

      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
      }

      if (state.filters.minPrice !== null) {
        filtered = filtered.filter(
          (item) => item.starting_price >= state.filters.minPrice
        );
      }

      if (state.filters.maxPrice !== null) {
        filtered = filtered.filter(
          (item) => item.starting_price <= state.filters.maxPrice
        );
      }

      return filtered;
    },
  },

  actions: {
    async fetchItems() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_URL}/items`);
        this.items = response.data.items || [];
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to fetch items";
        console.error("Error fetching items:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchFeaturedItems() {
      try {
        const response = await axios.get(`${API_URL}/items/featured`);
        this.featuredItems = response.data.items || [];
      } catch (error) {
        console.error("Error fetching featured items:", error);
      }
    },

    async fetchUserItems() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/items/user`);
        this.userItems = response.data.items || [];
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch user items";
        console.error("Error fetching user items:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchItemById(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/items/${id}`);
        this.currentItem = response.data.item;
        return this.currentItem;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to fetch item";
        console.error("Error fetching item:", error);
      } finally {
        this.loading = false;
      }
    },

    async createItem(itemData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_URL}/items`, itemData);
        this.items.unshift(response.data.item);
        return { success: true, item: response.data.item };
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to create item";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateItem(id, itemData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.put(`${API_URL}/items/${id}`, itemData);
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.items[index] = response.data.item;
        }
        return { success: true, item: response.data.item };
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to update item";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(id) {
      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`${API_URL}/items/${id}`);
        this.items = this.items.filter((item) => item.id !== id);
        this.userItems = this.userItems.filter((item) => item.id !== id);
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to delete item";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },

    clearFilters() {
      this.filters = {
        category: "",
        minPrice: null,
        maxPrice: null,
        searchQuery: "",
      };
    },
  },
});