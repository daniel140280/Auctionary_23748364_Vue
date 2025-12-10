<template>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-20">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
          ></div>
        </div>
  
        <!-- Item Details -->
        <div v-else-if="item" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Image Gallery -->
          <div>
            <div class="card overflow-hidden">
              <img
                :src="item.image_url || placeholderImage"
                :alt="item.name"
                class="w-full h-96 object-cover"
              />
            </div>
          </div>
  
          <!-- Item Information -->
          <div>
            <div class="card p-6">
              <div
                class="text-sm text-primary-600 font-semibold uppercase tracking-wide mb-2"
              >
                {{ item.category || "Antique" }}
              </div>
              <h1 class="text-3xl font-display font-bold text-gray-900 mb-4">
                {{ item.name }}
              </h1>
  
              <div class="mb-6">
                <div class="text-sm text-gray-500 mb-1">Current Bid</div>
                <div class="text-4xl font-bold text-gray-900">
                  ${{ formatPrice(item.current_bid || item.starting_price) }}
                </div>
              </div>
  
              <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div class="text-xs text-gray-500">Bids</div>
                  <div class="text-lg font-semibold">
                    {{ item.bid_count || 0 }}
                  </div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Time Left</div>
                  <div class="text-lg font-semibold text-red-600">
                    {{ timeLeft }}
                  </div>
                </div>
              </div>
  
              <button class="w-full btn-primary mb-4">Place Bid</button>
  
              <div class="text-center text-sm text-gray-500 mb-6">
                or
                <button
                  class="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Watch this item
                </button>
              </div>
  
              <div class="border-t pt-6">
                <h2 class="text-lg font-semibold mb-4">Description</h2>
                <p class="text-gray-700 whitespace-pre-line">
                  {{ item.description }}
                </p>
              </div>
  
              <div class="border-t pt-6 mt-6">
                <h2 class="text-lg font-semibold mb-4">Item Details</h2>
                <dl class="space-y-2">
                  <div v-if="item.condition" class="flex justify-between">
                    <dt class="text-gray-600">Condition:</dt>
                    <dd class="font-medium">{{ item.condition }}</dd>
                  </div>
                  <div v-if="item.year" class="flex justify-between">
                    <dt class="text-gray-600">Year:</dt>
                    <dd class="font-medium">{{ item.year }}</dd>
                  </div>
                  <div v-if="item.maker" class="flex justify-between">
                    <dt class="text-gray-600">Maker:</dt>
                    <dd class="font-medium">{{ item.maker }}</dd>
                  </div>
                  <div v-if="item.materials" class="flex justify-between">
                    <dt class="text-gray-600">Materials:</dt>
                    <dd class="font-medium">{{ item.materials }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Not Found -->
        <div v-else class="text-center py-20">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
          <p class="text-gray-600 mb-6">
            The item you're looking for doesn't exist.
          </p>
          <router-link to="/browse" class="btn-primary">
            Browse All Items
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useItemsStore } from "../stores/items";
  
  export default {
    name: "ItemDetail",
    setup() {
      const route = useRoute();
      const itemsStore = useItemsStore();
  
      const loading = ref(true);
      const item = ref(null);
  
      const placeholderImage =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3C/svg%3E';
  
      const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(price || 0);
      };
  
      const timeLeft = computed(() => {
        if (!item.value?.end_time) return "N/A";
  
        const now = new Date();
        const end = new Date(item.value.end_time);
        const diff = end - now;
  
        if (diff <= 0) return "Auction Ended";
  
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
      });
  
      onMounted(async () => {
        loading.value = true;
        try {
          item.value = await itemsStore.fetchItemById(route.params.id);
        } catch (error) {
          console.error("Error fetching item:", error);
        } finally {
          loading.value = false;
        }
      });
  
      return {
        loading,
        item,
        placeholderImage,
        timeLeft,
        formatPrice,
      };
    },
  };
  </script>