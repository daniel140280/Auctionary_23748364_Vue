<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Page Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">
            Browse Auctions
          </h1>
          <p class="text-gray-600">Discover unique antique treasures</p>
        </div>
      </div>
  
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Filters Sidebar -->
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-24">
              <h2
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between"
              >
                Filters
                <button
                  @click="clearAllFilters"
                  class="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </h2>
  
              <!-- Search -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div class="relative">
                  <input
                    v-model="filters.searchQuery"
                    type="text"
                    placeholder="Search items..."
                    class="input-field pl-10"
                  />
                  <Search class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
  
              <!-- Category Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select v-model="filters.category" class="input-field">
                  <option value="">All Categories</option>
                  <option value="pocket-watches">Pocket Watches</option>
                  <option value="wristwatches">Wristwatches</option>
                  <option value="jewellery">Jewellery</option>
                  <option value="collectibles">Collectibles</option>
                  <option value="other">Other Antiques</option>
                </select>
              </div>
  
              <!-- Price Range -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model.number="filters.minPrice"
                    type="number"
                    placeholder="Min"
                    class="input-field"
                  />
                  <input
                    v-model.number="filters.maxPrice"
                    type="number"
                    placeholder="Max"
                    class="input-field"
                  />
                </div>
              </div>
  
              <!-- Condition Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <div class="space-y-2">
                  <label
                    v-for="condition in conditions"
                    :key="condition.value"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      :value="condition.value"
                      v-model="filters.conditions"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{
                      condition.label
                    }}</span>
                  </label>
                </div>
              </div>
  
              <!-- Status Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Auction Status
                </label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      value="all"
                      v-model="filters.status"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">All Auctions</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      value="active"
                      v-model="filters.status"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Active Only</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      value="ending-soon"
                      v-model="filters.status"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Ending Soon</span>
                  </label>
                </div>
              </div>
  
              <!-- Apply Filters Button (Mobile) -->
              <button @click="applyFilters" class="lg:hidden w-full btn-primary">
                Apply Filters
              </button>
            </div>
          </div>
  
          <!-- Items Grid -->
          <div class="lg:col-span-3">
            <!-- Sort and View Options -->
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
            >
              <div class="text-sm text-gray-600">
                {{ totalItems }} items found
              </div>
  
              <div class="flex items-center space-x-4">
                <!-- Sort By -->
                <select v-model="sortBy" class="input-field py-2">
                  <option value="newest">Newest First</option>
                  <option value="ending-soon">Ending Soon</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="most-bids">Most Bids</option>
                </select>
  
                <!-- View Toggle -->
                <div class="flex rounded-lg border border-gray-300">
                  <button
                    @click="viewMode = 'grid'"
                    :class="[
                      'p-2 rounded-l-lg',
                      viewMode === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50',
                    ]"
                  >
                    <Grid class="w-5 h-5" />
                  </button>
                  <button
                    @click="viewMode = 'list'"
                    :class="[
                      'p-2 rounded-r-lg border-l border-gray-300',
                      viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50',
                    ]"
                  >
                    <List class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Loading State -->
            <div
              v-if="loading"
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <div v-for="n in 6" :key="n" class="card animate-pulse">
                <div class="h-64 bg-gray-300"></div>
                <div class="p-4 space-y-3">
                  <div class="h-4 bg-gray-300 rounded"></div>
                  <div class="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
  
            <!-- Grid View -->
            <div
              v-else-if="viewMode === 'grid' && filteredItems.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <ItemCard
                v-for="item in paginatedItems"
                :key="item.id"
                :item="item"
              />
            </div>
  
            <!-- List View -->
            <div
              v-else-if="viewMode === 'list' && filteredItems.length > 0"
              class="space-y-4"
            >
              <div
                v-for="item in paginatedItems"
                :key="item.id"
                class="card p-4 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow cursor-pointer"
                @click="$router.push(`/items/${item.id}`)"
              >
                <img
                  v-if="item.image_url"
                  :src="item.image_url"
                  :alt="item.name"
                  class="w-full sm:w-48 h-48 object-cover rounded-lg"
                />
                <div
                  v-else
                  class="w-full sm:w-48 h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center"
                >
                  <Clock class="w-12 h-12 text-primary-400" />
                </div>
  
                <div class="flex-1">
                  <div
                    class="text-xs text-primary-600 font-semibold uppercase tracking-wide mb-1"
                  >
                    {{ item.category || "Antique" }}
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">
                    {{ item.name }}
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    {{ item.description }}
                  </p>
  
                  <div class="flex flex-wrap items-center gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Current Bid:</span>
                      <span class="text-xl font-bold text-gray-900 ml-2">
                        ${{
                          formatPrice(item.current_bid || item.starting_price)
                        }}
                      </span>
                    </div>
                    <div class="flex items-center text-gray-500">
                      <Users class="w-4 h-4 mr-1" />
                      {{ item.bid_count || 0 }} bids
                    </div>
                    <div
                      v-if="item.end_time"
                      class="flex items-center text-gray-500"
                    >
                      <Clock class="w-4 h-4 mr-1" />
                      {{ getTimeLeft(item.end_time) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- No Results -->
            <div v-else class="text-center py-12">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <Search class="w-8 h-8 text-gray-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                No items found
              </h3>
              <p class="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <button @click="clearAllFilters" class="btn-secondary">
                Clear All Filters
              </button>
            </div>
  
            <!-- Pagination -->
            <div
              v-if="filteredItems.length > itemsPerPage"
              class="mt-8 flex justify-center"
            >
              <nav class="flex items-center space-x-2">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
  
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'px-4 py-2 rounded-lg',
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
                  ]"
                >
                  {{ page }}
                </button>
  
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useItemsStore } from "../../stores/items";
  import ItemCard from "../components/ItemCard.vue";
  import { Search, Grid, List, Clock, Users } from "lucide-vue-next";
  
  export default {
    name: "BrowsePage",
    components: {
      ItemCard,
      Search,
      Grid,
      List,
      Clock,
      Users,
    },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const itemsStore = useItemsStore();
  
      const loading = ref(true);
      const viewMode = ref("grid");
      const sortBy = ref("newest");
      const currentPage = ref(1);
      const itemsPerPage = 12;
  
      const filters = reactive({
        searchQuery: "",
        category: "",
        minPrice: null,
        maxPrice: null,
        conditions: [],
        status: "all",
      });
  
      const conditions = [
        { value: "mint", label: "Mint" },
        { value: "excellent", label: "Excellent" },
        { value: "good", label: "Good" },
        { value: "fair", label: "Fair" },
        { value: "poor", label: "Poor" },
      ];
  
      const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(price || 0);
      };
  
      const getTimeLeft = (endTime) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;
  
        if (diff <= 0) return "Ended";
  
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
  
        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
      };
  
      const filteredItems = computed(() => {
        let items = [...itemsStore.items];
  
        // Apply search
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          items = items.filter(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query)
          );
        }
  
        // Apply category filter
        if (filters.category) {
          items = items.filter((item) => item.category === filters.category);
        }
  
        // Apply price range
        if (filters.minPrice !== null) {
          items = items.filter(
            (item) =>
              (item.current_bid || item.starting_price) >= filters.minPrice
          );
        }
        if (filters.maxPrice !== null) {
          items = items.filter(
            (item) =>
              (item.current_bid || item.starting_price) <= filters.maxPrice
          );
        }
  
        // Apply condition filter
        if (filters.conditions.length > 0) {
          items = items.filter((item) =>
            filters.conditions.includes(item.condition)
          );
        }
  
        // Apply status filter
        if (filters.status === "active") {
          items = items.filter((item) => item.status === "active");
        } else if (filters.status === "ending-soon") {
          items = items.filter((item) => {
            if (!item.end_time) return false;
            const diff = new Date(item.end_time) - new Date();
            return diff > 0 && diff < 24 * 60 * 60 * 1000; // Less than 24 hours
          });
        }
  
        // Apply sorting
        if (sortBy.value === "newest") {
          items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy.value === "ending-soon") {
          items.sort((a, b) => new Date(a.end_time) - new Date(b.end_time));
        } else if (sortBy.value === "price-low") {
          items.sort(
            (a, b) =>
              (a.current_bid || a.starting_price) -
              (b.current_bid || b.starting_price)
          );
        } else if (sortBy.value === "price-high") {
          items.sort(
            (a, b) =>
              (b.current_bid || b.starting_price) -
              (a.current_bid || a.starting_price)
          );
        } else if (sortBy.value === "most-bids") {
          items.sort((a, b) => (b.bid_count || 0) - (a.bid_count || 0));
        }
  
        return items;
      });
  
      const totalItems = computed(() => filteredItems.value.length);
      const totalPages = computed(() =>
        Math.ceil(totalItems.value / itemsPerPage)
      );
  
      const paginatedItems = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredItems.value.slice(start, end);
      });
  
      const applyFilters = () => {
        currentPage.value = 1;
      };
  
      const clearAllFilters = () => {
        filters.searchQuery = "";
        filters.category = "";
        filters.minPrice = null;
        filters.maxPrice = null;
        filters.conditions = [];
        filters.status = "all";
        currentPage.value = 1;
      };
  
      // Watch for route query changes
      watch(
        () => route.query.category,
        (newCategory) => {
          if (newCategory) {
            filters.category = newCategory;
          }
        },
        { immediate: true }
      );
  
      onMounted(async () => {
        loading.value = true;
        try {
          await itemsStore.fetchItems();
        } catch (error) {
          console.error("Error fetching items:", error);
        } finally {
          loading.value = false;
        }
      });
  
      return {
        loading,
        viewMode,
        sortBy,
        currentPage,
        itemsPerPage,
        filters,
        conditions,
        filteredItems,
        totalItems,
        totalPages,
        paginatedItems,
        formatPrice,
        getTimeLeft,
        applyFilters,
        clearAllFilters,
      };
    },
  };
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>