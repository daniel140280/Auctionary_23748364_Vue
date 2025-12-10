<template>
    <div
      class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-accent-50"
    >
      <div class="max-w-md w-full">
        <!-- Logo and Header -->
        <div class="text-center mb-8">
          <router-link to="/" class="inline-flex items-center space-x-2 mb-6">
            <div
              class="bg-gradient-to-br from-primary-600 to-primary-800 p-3 rounded-lg"
            >
              <svg
                class="w-10 h-10 text-white"
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
            <span class="text-3xl font-display font-bold text-primary-800"
              >Auctionary</span
            >
          </router-link>
          <h2 class="text-3xl font-display font-bold text-gray-900">
            Welcome back
          </h2>
          <p class="mt-2 text-gray-600">Sign in to your account to continue</p>
        </div>
  
        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  autocomplete="email"
                  required
                  class="input-field pl-10"
                  :class="{
                    'border-red-500 focus:ring-red-500':
                      submitted && errors.email,
                  }"
                  placeholder="you@example.com"
                />
              </div>
              <p
                v-if="submitted && errors.email"
                class="mt-2 text-sm text-red-600"
              >
                {{ errors.email }}
              </p>
            </div>
  
            <!-- Password Field -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  class="input-field pl-10 pr-10"
                  :class="{
                    'border-red-500 focus:ring-red-500':
                      submitted && errors.password,
                  }"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <EyeOff
                    v-if="showPassword"
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                  />
                  <Eye v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <p
                v-if="submitted && errors.password"
                class="mt-2 text-sm text-red-600"
              >
                {{ errors.password }}
              </p>
            </div>
  
            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="formData.rememberMe"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
  
              <div class="text-sm">
                <router-link
                  to="/forgot-password"
                  class="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot password?
                </router-link>
              </div>
            </div>
  
            <!-- Error Message -->
            <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4">
              <div class="flex">
                <AlertCircle class="h-5 w-5 text-red-400" />
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ errorMessage }}</p>
                </div>
              </div>
            </div>
  
            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full btn-primary flex items-center justify-center"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              <span v-if="!isLoading">Sign in</span>
              <span v-else class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            </button>
          </form>
  
          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500"
                  >Don't have an account?</span
                >
              </div>
            </div>
  
            <div class="mt-6">
              <router-link
                to="/register"
                class="w-full btn-secondary flex items-center justify-center"
              >
                Create new account
              </router-link>
            </div>
          </div>
        </div>
  
        <!-- Back to Home -->
        <div class="text-center mt-6">
          <router-link
            to="/"
            class="text-sm text-gray-600 hover:text-primary-600"
          >
            ← Back to home
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "../stores/auth";
  import { useToast } from "vue-toastification";
  import * as EmailValidator from "email-validator";
  import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-vue-next";
  
  export default {
    name: "LoginPage",
    components: {
      Mail,
      Lock,
      Eye,
      EyeOff,
      AlertCircle,
    },
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();
      const toast = useToast();
  
      const formData = reactive({
        email: "",
        password: "",
        rememberMe: false,
      });
  
      const submitted = ref(false);
      const isLoading = ref(false);
      const showPassword = ref(false);
      const errorMessage = ref("");
      const errors = reactive({
        email: "",
        password: "",
      });
  
      const validateForm = () => {
        errors.email = "";
        errors.password = "";
        let isValid = true;
  
        // Email validation
        if (!formData.email) {
          errors.email = "Email address is required";
          isValid = false;
        } else if (!EmailValidator.validate(formData.email)) {
          errors.email = "Please enter a valid email address";
          isValid = false;
        }
  
        // Password validation
        if (!formData.password) {
          errors.password = "Password is required";
          isValid = false;
        } else if (formData.password.length < 8) {
          errors.password = "Password must be at least 8 characters";
          isValid = false;
        }
  
        return isValid;
      };
  
      const handleSubmit = async () => {
        submitted.value = true;
        errorMessage.value = "";
  
        if (!validateForm()) {
          return;
        }
  
        isLoading.value = true;
  
        try {
          const result = await authStore.login(formData.email, formData.password);
  
          if (result.success) {
            toast.success("Welcome back!");
            router.push("/");
          } else {
            errorMessage.value = result.error || "Invalid email or password";
          }
        } catch (error) {
          errorMessage.value = "An error occurred. Please try again.";
          console.error("Login error:", error);
        } finally {
          isLoading.value = false;
        }
      };
  
      return {
        formData,
        submitted,
        isLoading,
        showPassword,
        errorMessage,
        errors,
        handleSubmit,
      };
    },
  };
  </script>