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
          Create your account
        </h2>
        <p class="mt-2 text-gray-600">Join our community of collectors</p>
      </div>

      <!-- Registration Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name Field -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <User class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                autocomplete="name"
                required
                class="input-field pl-10"
                :class="{
                  'border-red-500 focus:ring-red-500': submitted && errors.name,
                }"
                placeholder="John Doe"
              />
            </div>
            <p
              v-if="submitted && errors.name"
              class="mt-2 text-sm text-red-600"
            >
              {{ errors.name }}
            </p>
          </div>

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
                autocomplete="new-password"
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
            <p class="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with a letter and number
            </p>
            <p
              v-if="submitted && errors.password"
              class="mt-2 text-sm text-red-600"
            >
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="input-field pl-10 pr-10"
                :class="{
                  'border-red-500 focus:ring-red-500':
                    submitted && errors.confirmPassword,
                }"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeOff
                  v-if="showConfirmPassword"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                />
                <Eye v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p
              v-if="submitted && errors.confirmPassword"
              class="mt-2 text-sm text-red-600"
            >
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="formData.acceptTerms"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-gray-700">
                I agree to the
                <router-link
                  to="/terms"
                  class="text-primary-600 hover:text-primary-500"
                  >Terms of Service</router-link
                >
                and
                <router-link
                  to="/privacy"
                  class="text-primary-600 hover:text-primary-500"
                  >Privacy Policy</router-link
                >
              </label>
            </div>
          </div>
          <p
            v-if="submitted && errors.acceptTerms"
            class="text-sm text-red-600"
          >
            {{ errors.acceptTerms }}
          </p>

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
            <span v-if="!isLoading">Create Account</span>
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
              Creating account...
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
                >Already have an account?</span
              >
            </div>
          </div>

          <div class="mt-6">
            <router-link
              to="/login"
              class="w-full btn-secondary flex items-center justify-center"
            >
              Sign in instead
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
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-vue-next";

export default {
  name: "RegisterPage",
  components: {
    User,
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });

    const submitted = ref(false);
    const isLoading = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const errorMessage = ref("");
    const errors = reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: "",
    });

    const validateForm = () => {
      errors.name = "";
      errors.email = "";
      errors.password = "";
      errors.confirmPassword = "";
      errors.acceptTerms = "";
      let isValid = true;

      // Name validation
      if (!formData.name || formData.name.trim().length < 2) {
        errors.name = "Please enter your full name (at least 2 characters)";
        isValid = false;
      }

      // Email validation
      if (!formData.email) {
        errors.email = "Email address is required";
        isValid = false;
      } else if (!EmailValidator.validate(formData.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }

      // Password validation
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      if (!formData.password) {
        errors.password = "Password is required";
        isValid = false;
      } else if (!passwordPattern.test(formData.password)) {
        errors.password =
          "Password must be at least 8 characters with a letter and number";
        isValid = false;
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }

      // Terms validation
      if (!formData.acceptTerms) {
        errors.acceptTerms =
          "You must accept the Terms of Service and Privacy Policy";
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
        const result = await authStore.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          toast.success("Account created successfully! Welcome to Auctionary.");
          router.push("/");
        } else {
          errorMessage.value =
            result.error || "Registration failed. Please try again.";
        }
      } catch (error) {
        errorMessage.value = "An error occurred. Please try again.";
        console.error("Registration error:", error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      submitted,
      isLoading,
      showPassword,
      showConfirmPassword,
      errorMessage,
      errors,
      handleSubmit,
    };
  },
};
</script>
