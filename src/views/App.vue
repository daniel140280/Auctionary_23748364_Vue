<template>
  <div>
    <!-- Navigation menu - this stays on all pages -->
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/questions">Questions</router-link>

      <span v-if="!item_in_storage">
          <router-link to="/login" class="nav-link">Login</router-link> |
          <router-link to="/register" class="nav-link">Register</router-link>
      </span>

      <span v-else class="logout-section">
          <router-link to="/profile" class="nav-link profile-link">Profile</router-link> |
          <button @click="handleLogout" class="logout-button">Logout</button>
      </span>
    </nav>
      <div class="message-container" v-if="successMessage || errorMessage">
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    <!-- router-view displays the current route's component -->
    <router-view/>
  </div>
</template>

<script>
import { UserService } from '@/services/user.service';

export default {
  name: 'App',
  data() {
    return {
      item_in_storage: localStorage.getItem('session_token'),
      successMessage: '',
      errorMessage: ''
    }
  },
  watch: {
    $route() {
    // Watch for route changes to update the menu if we log in/out
    this.item_in_storage = localStorage.getItem('session_token');
    this.successMessage = '';
    this.errorMessage = '';

    if (this.$route.name === 'Home' && localStorage.getItem('session_token')) {
      this.successMessage = 'You have successfully logged in!';
      setTimeout(() => { this.successMessage = ''; }, 5000);
    }
  }
  },
  methods: {
      handleLogout() {
        // Clear previous messages
        this.successMessage = '';
        this.errorMessage = '';
          // 1. Call Backend to invalidate token
          UserService.logout()
          .then((data) => {
              // 2. Clear Local Storage
              localStorage.removeItem('session_token');
              localStorage.removeItem('user_id');
              
              // 3. Update State
              this.item_in_storage = null;
              this.successMessage = data.message;
              setTimeout(() => {
                // 4. Redirect to Home (or Login)
              this.$router.push('/login');
              }, 1000);
          })
          .catch(err => {
              console.error("Logout failed", err);
              this.errorMessage = 'Logout failed on server. You have been logged out locally.';
              // Force logout on frontend even if backend fails
              localStorage.removeItem('session_token');
              this.item_in_storage = null;
              this.$router.push('/login');
          });
      }
  }
}
</script>

<style scoped>
nav {
  padding: 1rem;
  background-color: #f0f0f0;
}

nav a {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #333;
}

nav a.router-link-active {
  font-weight: bold;
  color: #42b983;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #42b983; 
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 1rem;
}

.logout-button:hover {
  background-color: #359268;
}

.message-container {
  padding: 10px;
  margin: 1rem auto;
  border-radius: 4px;
  max-width: 400px;
  text-align: center;
}

.success-message {
  background-color: #e6ffed;
  color: #359268;
  border: 1px solid #42b983;
  padding: 0.5rem;
}

.error-message {
  background-color: #ffeeee;
  color: #d9534f;
  border: 1px solid #d9534f;
  padding: 0.5rem;
}
</style>
