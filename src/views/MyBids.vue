<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">
          My Bids
        </h1>
        <p class="text-gray-600">Track your bidding activity</p>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'active'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'active'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Active Bids
          </button>
          <button
            @click="activeTab = 'won'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'won'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Won
          </button>
          <button
            @click="activeTab = 'lost'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'lost'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Lost
          </button>
        </nav>
      </div>

      <!-- Bids List -->
      <div class="card">
        <div v-if="loading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="n in 3" :key="n" class="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div
          v-else-if="filteredBids.length > 0"
          class="divide-y divide-gray-200"
        >
          <div
            v-for="bid in filteredBids"
            :key="bid.id"
            class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="$router.push(`/items/${bid.item_id}`)"
          >
            <div class="flex items-center space-x-4">
              <img
                :src="bid.item_image || placeholderImage"
                :alt="bid.item_name"
                class="w-20 h-20 object-cover rounded-lg"
              />

              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate">
                  {{ bid.item_name }}
                </h3>
                <div class="mt-1 flex items-center space-x-4 text-sm">
                  <span class="text-gray-600">
                    Your Bid:
                    <span class="font-semibold"
                      >${{ formatPrice(bid.amount) }}</span
                    >
                  </span>
                  <span class="text-gray-600">
                    Current:
                    <span class="font-semibold"
                      >${{ formatPrice(bid.current_bid) }}</span
                    >
                  </span>
                  <span v-if="bid.time_left" class="text-gray-600">
                    {{ bid.time_left }}
                  </span>
                </div>
              </div>

              <div>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    bid.status === 'winning'
                      ? 'bg-green-100 text-green-800'
                      : bid.status === 'outbid'
                      ? 'bg-red-100 text-red-800'
                      : bid.status === 'won'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ getStatusText(bid.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-12 text-center">
          <Gavel class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No bids yet</h3>
          <p class="text-gray-600 mb-6">Start bidding on items you love</p>
          <router-link to="/browse" class="btn-primary">
            Browse Auctions
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { Gavel } from "lucide-vue-next";

export default {
  name: "MyBids",
  components: {
    Gavel,
  },
  setup() {
    const loading = ref(true);
    const activeTab = ref("active");
    const bids = ref([]);

    const placeholderImage =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f0f0f0" width="80" height="80"/%3E%3C/svg%3E';

    const filteredBids = computed(() => {
      if (activeTab.value === "active") {
        return bids.value.filter(
          (bid) => bid.status === "winning" || bid.status === "outbid"
        );
      } else if (activeTab.value === "won") {
        return bids.value.filter((bid) => bid.status === "won");
      } else {
        return bids.value.filter((bid) => bid.status === "lost");
      }
    });

    const formatPrice = (price) => {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price || 0);
    };

    const getStatusText = (status) => {
      const statusMap = {
        winning: "Winning",
        outbid: "Outbid",
        won: "Won",
        lost: "Lost",
      };
      return statusMap[status] || status;
    };

    onMounted(async () => {
      loading.value = true;
      try {
        // TODO: Fetch user bids from API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        bids.value = []; // Replace with actual API call
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      activeTab,
      bids,
      filteredBids,
      placeholderImage,
      formatPrice,
      getStatusText,
    };
  },
};
</script>
