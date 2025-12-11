<template>
    <div class="auth-options">
      <router-link to="/login">
        <button class="auth-btn">Login</button>
      </router-link>
      <router-link to="/register">
        <button class="auth-btn secondary">Create Account</button>
      </router-link>
    </div>
    <div>
         <!-- Home page has its own content -->
        <h1>{{welcome_message}}</h1>
        <p>This is the home page. Use the navigation links to go to different pages.</p>    
    </div>
        <h2>{{search_message}}</h2>
        <em v-if="loading">Loading items...</em>

            <ul v-if="items.length">
                <li v-for="item in items" :key="item.item_id">
                  <router-link :to="`/item/${item.item_id}`">
                    {{ item.name + ' by ' +  item.first_name }}
                  </router-link>
                </li>
            </ul>
            <div v-else-if="!error">
             <p>No items are currently available for auction. Check back soon!</p>
        </div>
    <div v-else-if="error">
      {{ error }}
    </div>
</template>

<script>
  import { CoreService } from '@/services/core.service';

    export default {
    name: 'Home',
    data(){
      //Home specific data - a function which returns an object. 
      //This object contains all of the data relevant to the component.
      return {
        welcome_message: "Auctionable - Welcome to the Auctionable App",
        search_message: "Search for items to bid on!",
        items: [],  //Array to hold fetched items
        error: "",
        loading: true
      }
    }, 
    mounted(){
      //Code to run when component is mounted
      CoreService.searchItems()
      .then(items => {
        this.items = items;
        this.loading = false;
      })
      .catch(err => {
        this.error = err.message || "Failed to load items. Check the server console."; 
        this.loading = false;
      });

    }
    //object containing all of the relevant methods for our component
  }
</script>
<style scoped>
  .auth-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.auth-btn {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
}

.auth-btn.secondary {
  background-color: #2c3e50; /* Different color for Register */
}
div {
    padding: 2rem;
}

h1 {
    color: #42b983;
}
</style>