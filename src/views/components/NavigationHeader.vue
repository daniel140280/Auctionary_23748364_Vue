<template>
    <header class="bg-white shadow-md sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2 group">
            <div
              class="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-lg group-hover:shadow-lg transition-shadow"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <span class="text-2xl font-display font-bold text-primary-800"
              >Auctionary</span
            >
          </router-link>
  
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link
              to="/"
              class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              Home
            </router-link>
            <router-link
              to="/browse"
              class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              Browse Auctions
            </router-link>
            <router-link
              to="/about"
              class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              About
            </router-link>
          </div>
  
          <!-- Auth Buttons / User Menu -->
          <div class="hidden md:flex items-center space-x-4">
            <template v-if="!isAuthenticated">
              <router-link
                to="/login"
                class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Login
              </router-link>
              <router-link to="/register" class="btn-primary">
                Sign Up
              </router-link>
            </template>
            <template v-else>
              <router-link to="/items/new" class="btn-secondary">
                + List Item
              </router-link>
  
              <!-- User Dropdown -->
              <div class="relative" ref="dropdownRef">
                <button
                  @click="toggleDropdown"
                  class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold"
                  >
                    {{ userInitials }}
                  </div>
                  <svg
                    class="w-5 h-5 text-gray-600"
                    :class="{ 'rotate-180': isDropdownOpen }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
  
                <!-- Dropdown Menu -->
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <div
                    v-if="isDropdownOpen"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                  >
                    <router-link
                      to="/account"
                      class="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      @click="closeDropdown"
                    >
                      My Account
                    </router-link>
                    <router-link
                      to="/account/items"
                      class="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      @click="closeDropdown"
                    >
                      My Items
                    </router-link>
                    <router-link
                      to="/account/bids"
                      class="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      @click="closeDropdown"
                    >
                      My Bids
                    </router-link>
                    <hr class="my-2" />
                    <button
                      @click="handleLogout"
                      class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </transition>
              </div>
            </template>
          </div>
  
          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
  
        <!-- Mobile Menu -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div v-if="isMobileMenuOpen" class="md:hidden py-4 space-y-2 border-t">
            <router-link
              to="/"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              @click="closeMobileMenu"
            >
              Home
            </router-link>
            <router-link
              to="/browse"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              @click="closeMobileMenu"
            >
              Browse Auctions
            </router-link>
            <router-link
              to="/about"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              @click="closeMobileMenu"
            >
              About
            </router-link>
  
            <template v-if="!isAuthenticated">
              <hr class="my-2" />
              <router-link
                to="/login"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                @click="closeMobileMenu"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-medium"
                @click="closeMobileMenu"
              >
                Sign Up
              </router-link>
            </template>
            <template v-else>
              <hr class="my-2" />
              <router-link
                to="/items/new"
                class="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-medium"
                @click="closeMobileMenu"
              >
                + List Item
              </router-link>
              <router-link
                to="/account"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                @click="closeMobileMenu"
              >
                My Account
              </router-link>
              <router-link
                to="/account/items"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                @click="closeMobileMenu"
              >
                My Items
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </template>
          </div>
        </transition>
      </nav>
    </header>
  </template>
  
  <script>
  import { ref, computed, onMounted, onUnmounted } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "../../stores/auth";
  import { useToast } from "vue-toastification";
  
  export default {
    name: "NavigationHeader",
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();
      const toast = useToast();
  
      const isDropdownOpen = ref(false);
      const isMobileMenuOpen = ref(false);
      const dropdownRef = ref(null);
  
      const isAuthenticated = computed(() => authStore.isAuthenticated);
      const currentUser = computed(() => authStore.currentUser);
  
      const userInitials = computed(() => {
        if (!currentUser.value) return "U";
        const name = currentUser.value.name || currentUser.value.email || "User";
        return name.charAt(0).toUpperCase();
      });
  
      const toggleDropdown = () => {
        isDropdownOpen.value = !isDropdownOpen.value;
      };
  
      const closeDropdown = () => {
        isDropdownOpen.value = false;
      };
  
      const toggleMobileMenu = () => {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
      };
  
      const closeMobileMenu = () => {
        isMobileMenuOpen.value = false;
      };
  
      const handleLogout = () => {
        authStore.logout();
        closeDropdown();
        closeMobileMenu();
        toast.success("Logged out successfully");
        router.push("/");
      };
  
      // Close dropdown when clicking outside
      const handleClickOutside = (event) => {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
          closeDropdown();
        }
      };
  
      onMounted(() => {
        document.addEventListener("click", handleClickOutside);
      });
  
      onUnmounted(() => {
        document.removeEventListener("click", handleClickOutside);
      });
  
      return {
        isAuthenticated,
        currentUser,
        userInitials,
        isDropdownOpen,
        isMobileMenuOpen,
        dropdownRef,
        toggleDropdown,
        closeDropdown,
        toggleMobileMenu,
        closeMobileMenu,
        handleLogout,
      };
    },
  };
  </script>