<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">
            My Items
          </h1>
          <p class="text-gray-600">Manage your auction listings</p>
        </div>
        <router-link to="/items/new" class="btn-primary">
          + List New Item
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="text-sm text-gray-500 mb-1">Total Items</div>
          <div class="text-3xl font-bold text-gray-900">
            {{ userItems.length }}
          </div>
        </div>
        <div class="card p-6">
          <div class="text-sm text-gray-500 mb-1">Active</div>
          <div class="text-3xl font-bold text-green-600">{{ activeCount }}</div>
        </div>
        <div class="card p-6">
          <div class="text-sm text-gray-500 mb-1">Sold</div>
          <div class="text-3xl font-bold text-blue-600">{{ soldCount }}</div>
        </div>
        <div class="card p-6">
          <div class="text-sm text-gray-500 mb-1">Total Revenue</div>
          <div class="text-3xl font-bold text-primary-600">
            ${{ totalRevenue }}
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div class="card">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold">Your Listings</h2>
        </div>

        <div v-if="loading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="n in 3" :key="n" class="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div v-else-if="userItems.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="item in userItems"
            :key="item.id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-4">
              <img
                :src="item.image_url || placeholderImage"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded-lg"
              />

              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate">
                  {{ item.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ item.category }}</p>
                <div class="mt-1 flex items-center space-x-4 text-sm">
                  <span class="text-gray-600">
                    Current Bid:
                    <span class="font-semibold"
                      >${{
                        formatPrice(item.current_bid || item.starting_price)
                      }}</span
                    >
                  </span>
                  <span class="text-gray-600">
                    {{ item.bid_count || 0 }} bids
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    item.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'sold'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ item.status || "draft" }}
                </span>

                <router-link
                  :to="`/items/${item.id}/edit`"
                  class="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit class="w-5 h-5" />
                </router-link>

                <button
                  @click="confirmDelete(item)"
                  class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-12 text-center">
          <Package class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            No items listed yet
          </h3>
          <p class="text-gray-600 mb-6">
            Start selling by creating your first auction listing
          </p>
          <router-link to="/items/new" class="btn-primary">
            List Your First Item
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useItemsStore } from "../stores/items";
import { useToast } from "vue-toastification";
import { Package, Edit, Trash2 } from "lucide-vue-next";

export default {
  name: "MyItems",
  components: {
    Package,
    Edit,
    Trash2,
  },
  setup() {
    const itemsStore = useItemsStore();
    const toast = useToast();

    const loading = ref(true);
    const placeholderImage =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f0f0f0" width="80" height="80"/%3E%3C/svg%3E';

    const userItems = computed(() => itemsStore.userItems);

    const activeCount = computed(
      () => userItems.value.filter((item) => item.status === "active").length
    );

    const soldCount = computed(
      () => userItems.value.filter((item) => item.status === "sold").length
    );

    const totalRevenue = computed(() => {
      const sold = userItems.value.filter((item) => item.status === "sold");
      const total = sold.reduce((sum, item) => sum + (item.sold_price || 0), 0);
      return formatPrice(total);
    });

    const formatPrice = (price) => {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price || 0);
    };

    const confirmDelete = async (item) => {
      if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        const result = await itemsStore.deleteItem(item.id);
        if (result.success) {
          toast.success("Item deleted successfully");
        } else {
          toast.error("Failed to delete item");
        }
      }
    };

    onMounted(async () => {
      loading.value = true;
      try {
        await itemsStore.fetchUserItems();
      } catch (error) {
        console.error("Error fetching user items:", error);
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      userItems,
      activeCount,
      soldCount,
      totalRevenue,
      placeholderImage,
      formatPrice,
      confirmDelete,
    };
  },
};
</script>
