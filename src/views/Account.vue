<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">
          My Account
        </h1>
        <p class="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <!-- Account Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-2">
            <button
              @click="activeTab = 'profile'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3',
                activeTab === 'profile'
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <User class="w-5 h-5" />
              <span>Profile Information</span>
            </button>
            <button
              @click="activeTab = 'security'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3',
                activeTab === 'security'
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <Lock class="w-5 h-5" />
              <span>Security</span>
            </button>
            <router-link
              to="/account/items"
              class="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-3"
            >
              <Package class="w-5 h-5" />
              <span>My Items</span>
            </router-link>
            <router-link
              to="/account/bids"
              class="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-3"
            >
              <Gavel class="w-5 h-5" />
              <span>My Bids</span>
            </router-link>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Profile Information Tab -->
          <div v-if="activeTab === 'profile'" class="card p-6">
            <h2 class="text-2xl font-semibold mb-6">Profile Information</h2>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- Name Field -->
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  v-model="profileForm.name"
                  type="text"
                  class="input-field"
                  required
                />
              </div>

              <!-- Email Field (Read-only) -->
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  class="input-field bg-gray-50"
                  disabled
                />
                <p class="mt-1 text-xs text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              <!-- Phone Field -->
              <div>
                <label
                  for="phone"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  v-model="profileForm.phone"
                  type="tel"
                  class="input-field"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <!-- Bio Field -->
              <div>
                <label
                  for="bio"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  v-model="profileForm.bio"
                  rows="4"
                  class="input-field"
                  placeholder="Tell us about yourself and your collecting interests..."
                ></textarea>
              </div>

              <!-- Success Message -->
              <div v-if="profileSuccess" class="rounded-lg bg-green-50 p-4">
                <div class="flex">
                  <CheckCircle class="h-5 w-5 text-green-400" />
                  <div class="ml-3">
                    <p class="text-sm text-green-800">
                      Profile updated successfully!
                    </p>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="profileLoading"
                class="btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': profileLoading }"
              >
                {{ profileLoading ? "Saving..." : "Save Changes" }}
              </button>
            </form>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="card p-6">
            <h2 class="text-2xl font-semibold mb-6">Change Password</h2>

            <form @submit.prevent="updatePassword" class="space-y-6">
              <!-- Current Password -->
              <div>
                <label
                  for="currentPassword"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="input-field"
                  required
                />
              </div>

              <!-- New Password -->
              <div>
                <label
                  for="newPassword"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="input-field"
                  required
                />
                <p class="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters with a letter and number
                </p>
              </div>

              <!-- Confirm New Password -->
              <div>
                <label
                  for="confirmPassword"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="input-field"
                  required
                />
              </div>

              <!-- Error Message -->
              <div v-if="passwordError" class="rounded-lg bg-red-50 p-4">
                <div class="flex">
                  <AlertCircle class="h-5 w-5 text-red-400" />
                  <div class="ml-3">
                    <p class="text-sm text-red-800">{{ passwordError }}</p>
                  </div>
                </div>
              </div>

              <!-- Success Message -->
              <div v-if="passwordSuccess" class="rounded-lg bg-green-50 p-4">
                <div class="flex">
                  <CheckCircle class="h-5 w-5 text-green-400" />
                  <div class="ml-3">
                    <p class="text-sm text-green-800">
                      Password updated successfully!
                    </p>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="passwordLoading"
                class="btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': passwordLoading }"
              >
                {{ passwordLoading ? "Updating..." : "Update Password" }}
              </button>
            </form>

            <!-- Account Actions -->
            <div class="mt-12 pt-8 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Account Actions
              </h3>
              <div class="space-y-4">
                <button
                  @click="handleLogout"
                  class="btn-secondary text-gray-700 hover:text-gray-900"
                >
                  <LogOut class="w-5 h-5 mr-2 inline" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useToast } from "vue-toastification";
import {
  User,
  Lock,
  Package,
  Gavel,
  CheckCircle,
  AlertCircle,
  LogOut,
} from "lucide-vue-next";

export default {
  name: "AccountPage",
  components: {
    User,
    Lock,
    Package,
    Gavel,
    CheckCircle,
    AlertCircle,
    LogOut,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toast = useToast();

    const activeTab = ref("profile");
    const profileLoading = ref(false);
    const profileSuccess = ref(false);
    const passwordLoading = ref(false);
    const passwordSuccess = ref(false);
    const passwordError = ref("");

    const currentUser = computed(() => authStore.currentUser);

    const profileForm = reactive({
      name: "",
      email: "",
      phone: "",
      bio: "",
    });

    const passwordForm = reactive({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const updateProfile = async () => {
      profileLoading.value = true;
      profileSuccess.value = false;

      try {
        // TODO: API call to update profile
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        profileSuccess.value = true;
        toast.success("Profile updated successfully!");

        setTimeout(() => {
          profileSuccess.value = false;
        }, 3000);
      } catch (error) {
        toast.error("Failed to update profile");
        console.error("Update profile error:", error);
      } finally {
        profileLoading.value = false;
      }
    };

    const updatePassword = async () => {
      passwordError.value = "";
      passwordSuccess.value = false;

      // Validate passwords
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordPattern.test(passwordForm.newPassword)) {
        passwordError.value =
          "Password must be at least 8 characters with a letter and number";
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        passwordError.value = "Passwords do not match";
        return;
      }

      passwordLoading.value = true;

      try {
        // TODO: API call to update password
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        passwordSuccess.value = true;
        toast.success("Password updated successfully!");

        // Clear form
        passwordForm.currentPassword = "";
        passwordForm.newPassword = "";
        passwordForm.confirmPassword = "";

        setTimeout(() => {
          passwordSuccess.value = false;
        }, 3000);
      } catch (error) {
        passwordError.value =
          "Failed to update password. Please check your current password.";
        console.error("Update password error:", error);
      } finally {
        passwordLoading.value = false;
      }
    };

    const handleLogout = () => {
      authStore.logout();
      toast.success("Logged out successfully");
      router.push("/");
    };

    onMounted(() => {
      if (currentUser.value) {
        profileForm.name = currentUser.value.name || "";
        profileForm.email = currentUser.value.email || "";
        profileForm.phone = currentUser.value.phone || "";
        profileForm.bio = currentUser.value.bio || "";
      }
    });

    return {
      activeTab,
      profileForm,
      passwordForm,
      profileLoading,
      profileSuccess,
      passwordLoading,
      passwordSuccess,
      passwordError,
      updateProfile,
      updatePassword,
      handleLogout,
    };
  },
};
</script>
