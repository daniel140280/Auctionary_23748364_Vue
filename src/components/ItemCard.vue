<template>
  <div class="card group cursor-pointer" @click="goToItem">
    <!-- Image -->
    <div class="relative h-64 overflow-hidden bg-gray-200">
      <img
        v-if="item.image_url"
        :src="item.image_url"
        :alt="item.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200"
      >
        <Clock class="w-16 h-16 text-primary-400" />
      </div>

      <!-- Featured Badge -->
      <div
        v-if="featured"
        class="absolute top-3 right-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
      >
        Featured
      </div>

      <!-- Status Badge -->
      <div v-if="item.status" class="absolute top-3 left-3">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <!-- Category -->
      <div
        class="text-xs text-primary-600 font-semibold uppercase tracking-wide mb-2"
      >
        {{ item.category || "Antique" }}
      </div>

      <!-- Title -->
      <h3
        class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors"
      >
        {{ item.name }}
      </h3>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ item.description }}
      </p>

      <!-- Price & Time -->
      <div class="flex justify-between items-end">
        <div>
          <div class="text-xs text-gray-500 mb-1">Current Bid</div>
          <div class="text-2xl font-bold text-gray-900">
            ${{ formatPrice(item.current_bid || item.starting_price) }}
          </div>
        </div>

        <div v-if="item.end_time" class="text-right">
          <div class="text-xs text-gray-500 mb-1">Time Left</div>
          <div class="text-sm font-semibold" :class="timeLeftClass">
            {{ timeLeft }}
          </div>
        </div>
      </div>

      <!-- Bid Count -->
      <div
        class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500"
      >
        <span class="flex items-center">
          <Users class="w-4 h-4 mr-1" />
          {{ item.bid_count || 0 }} bids
        </span>
        <span class="flex items-center">
          <Eye class="w-4 h-4 mr-1" />
          {{ item.view_count || 0 }} views
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Clock, Users, Eye } from "lucide-vue-next";

export default {
  name: "ItemCard",
  components: {
    Clock,
    Users,
    Eye,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();

    const formatPrice = (price) => {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price || 0);
    };

    const timeLeft = computed(() => {
      if (!props.item.end_time) return "N/A";

      const now = new Date();
      const end = new Date(props.item.end_time);
      const diff = end - now;

      if (diff <= 0) return "Ended";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    });

    const timeLeftClass = computed(() => {
      if (!props.item.end_time) return "text-gray-500";

      const now = new Date();
      const end = new Date(props.item.end_time);
      const diff = end - now;
      const hours = diff / (1000 * 60 * 60);

      if (hours <= 0) return "text-gray-500";
      if (hours < 24) return "text-red-600";
      if (hours < 72) return "text-orange-600";
      return "text-green-600";
    });

    const statusText = computed(() => {
      const status = props.item.status?.toLowerCase();
      if (status === "active") return "Live";
      if (status === "ended") return "Ended";
      if (status === "pending") return "Pending";
      return status || "Unknown";
    });

    const statusClass = computed(() => {
      const status = props.item.status?.toLowerCase();
      if (status === "active") return "bg-green-500 text-white";
      if (status === "ended") return "bg-gray-500 text-white";
      if (status === "pending") return "bg-yellow-500 text-white";
      return "bg-gray-500 text-white";
    });

    const goToItem = () => {
      router.push(`/items/${props.item.id}`);
    };

    return {
      formatPrice,
      timeLeft,
      timeLeftClass,
      statusText,
      statusClass,
      goToItem,
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
