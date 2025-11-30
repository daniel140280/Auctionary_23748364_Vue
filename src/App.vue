<template>
  <div>
    <!-- Navigation menu - this stays on all pages -->
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/questions">Questions</router-link>
    </nav>
    <!-- router-view displays the current route's component -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
</style>
