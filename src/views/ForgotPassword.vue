<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-accent-50"
  >
    <div class="max-w-md w-full">
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
          Forgot Password?
        </h2>
        <p class="mt-2 text-gray-600">
          Enter your email to receive reset instructions
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input-field"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': loading }"
          >
            {{ loading ? "Sending..." : "Send Reset Link" }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <router-link
            to="/login"
            class="text-sm text-primary-600 hover:text-primary-500"
          >
            ← Back to login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useToast } from "vue-toastification";

export default {
  name: "ForgotPassword",
  setup() {
    const email = ref("");
    const loading = ref(false);
    const toast = useToast();

    const handleSubmit = async () => {
      loading.value = true;
      try {
        // TODO: API call to send reset email
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Password reset instructions sent to your email");
        email.value = "";
      } catch (error) {
        toast.error("Failed to send reset email");
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      loading,
      handleSubmit,
    };
  },
};
</script>
