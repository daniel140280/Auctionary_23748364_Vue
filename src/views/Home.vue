<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white"
    >
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"
      >
        <div class="max-w-3xl">
          <h1
            class="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight"
          >
            Discover Timeless <br class="hidden md:block" />
            Antique Treasures
          </h1>
          <p class="text-xl md:text-2xl text-gray-200 mb-8">
            Bid on exquisite pocket watches and fine antiques from collectors
            worldwide
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <router-link to="/browse" class="btn-primary text-center">
              Browse Auctions
            </router-link>
            <router-link
              to="/register"
              class="btn-secondary bg-white border-white text-primary-700 hover:bg-gray-100 text-center"
            >
              Start Selling
            </router-link>
          </div>
        </div>
      </div>

      <!-- Decorative wave -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </section>

    <!-- Featured Items Carousel -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-display font-bold text-gray-900 mb-4">
            Featured Auctions
          </h2>
          <p class="text-xl text-gray-600">
            Handpicked exceptional pieces ending soon
          </p>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
          ></div>
        </div>

        <div v-else-if="featuredItems.length > 0" class="relative">
          <swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="30"
            :loop="true"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            :pagination="{ clickable: true }"
            :navigation="true"
            :breakpoints="{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }"
            class="featured-swiper"
          >
            <swiper-slide v-for="item in featuredItems" :key="item.id">
              <ItemCard :item="item" :featured="true" />
            </swiper-slide>
          </swiper>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500">No featured items at the moment</p>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-display font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p class="text-xl text-gray-600">Find what you're looking for</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="category in categories"
            :key="category.name"
            @click="browseCategory(category.slug)"
            class="group cursor-pointer"
          >
            <div
              class="card text-center p-8 hover:scale-105 transition-transform duration-300"
            >
              <div
                class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-colors"
              >
                <component
                  :is="category.icon"
                  class="w-8 h-8 text-primary-600"
                />
              </div>
              <h3 class="font-semibold text-lg mb-2">{{ category.name }}</h3>
              <p class="text-sm text-gray-500">{{ category.count }} items</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Auctions Grid -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-4xl font-display font-bold text-gray-900 mb-2">
              Latest Auctions
            </h2>
            <p class="text-xl text-gray-600">Recently listed items</p>
          </div>
          <router-link to="/browse" class="btn-secondary">
            View All
          </router-link>
        </div>

        <div
          v-if="loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div v-for="n in 8" :key="n" class="card animate-pulse">
            <div class="h-64 bg-gray-300"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-300 rounded"></div>
              <div class="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <div
          v-else-if="latestItems.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <ItemCard v-for="item in latestItems" :key="item.id" :item="item" />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500">No items available</p>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-display font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p class="text-xl text-gray-600">
            Simple steps to start buying or selling
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div
              class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center"
            >
              <span class="text-3xl font-bold text-accent-600">1</span>
            </div>
            <h3 class="text-xl font-semibold mb-3">Create Account</h3>
            <p class="text-gray-600">
              Sign up in minutes and join our community of collectors
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center"
            >
              <span class="text-3xl font-bold text-accent-600">2</span>
            </div>
            <h3 class="text-xl font-semibold mb-3">Browse & Bid</h3>
            <p class="text-gray-600">
              Explore curated antiques and place your bids
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center"
            >
              <span class="text-3xl font-bold text-accent-600">3</span>
            </div>
            <h3 class="text-xl font-semibold mb-3">Win & Collect</h3>
            <p class="text-gray-600">
              Win auctions and add treasures to your collection
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-16 bg-gradient-to-r from-primary-700 to-primary-900 text-white"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-display font-bold mb-6">
          Ready to Start Your Collection?
        </h2>
        <p class="text-xl mb-8 text-gray-200">
          Join thousands of collectors and discover rare antique treasures
        </p>
        <router-link
          to="/register"
          class="btn-primary bg-white text-primary-700 hover:bg-gray-100"
        >
          Get Started Today
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useItemsStore } from "../stores/items";
import ItemCard from "../components/ItemCard.vue";
import { Clock, Watch, Gem, Award } from "lucide-vue-next";

export default {
  name: "HomePage",
  components: {
    Swiper,
    SwiperSlide,
    ItemCard,
  },
  setup() {
    const router = useRouter();
    const itemsStore = useItemsStore();

    const loading = ref(true);
    const modules = [Navigation, Pagination, Autoplay];

    const categories = [
      {
        name: "Pocket Watches",
        slug: "pocket-watches",
        icon: Clock,
        count: 124,
      },
      { name: "Wristwatches", slug: "wristwatches", icon: Watch, count: 89 },
      { name: "Jewelry", slug: "jewelry", icon: Gem, count: 156 },
      { name: "Collectibles", slug: "collectibles", icon: Award, count: 203 },
    ];

    const featuredItems = computed(() => itemsStore.featuredItems.slice(0, 6));
    const latestItems = computed(() => itemsStore.items.slice(0, 8));

    const browseCategory = (categorySlug) => {
      router.push(`/browse?category=${categorySlug}`);
    };

    onMounted(async () => {
      loading.value = true;
      try {
        await Promise.all([
          itemsStore.fetchFeaturedItems(),
          itemsStore.fetchItems(),
        ]);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      modules,
      categories,
      featuredItems,
      latestItems,
      browseCategory,
    };
  },
};
</script>

<style scoped>
.featured-swiper {
  padding-bottom: 50px;
}

.featured-swiper :deep(.swiper-pagination-bullet) {
  @apply bg-primary-600;
}

.featured-swiper :deep(.swiper-button-next),
.featured-swiper :deep(.swiper-button-prev) {
  @apply text-primary-600;
}
</style>
