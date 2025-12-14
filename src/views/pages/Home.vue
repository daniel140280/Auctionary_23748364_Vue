<template>
    <div class="home-wrapper">

      <div class="auth-options">
        <router-link to="/login"><button class="auth-btn">Login</button></router-link>
        <router-link to="/register"><button class="auth-btn secondary">Create Account</button></router-link>
      </div>

    <div class="hero">
        <h1>{{welcome_message}}</h1>
        <p>The premium auction house for sexy ass watches.</p>
        
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="Search items by name or description"/>
        </div>
    </div>

    <div class="results-area">
      <h2 class="section-title">{{search_message}}</h2>

      <em v-if="loading">Loading items...</em>
      <div v-else-if="error" class="error-msg">{{ error }}</div>

      <div v-else-if="filteredItems.length" class="item-grid">
        
        <div v-for="item in filteredItems" :key="item.item_id" class="item-card">
            <div class="card-header">
                <h3>{{ item.name }}</h3>
                <span class="seller-tag">by {{ item.first_name }} {{ item.last_name }}</span>
            </div>
            
            <div class="card-body">
                <p class="description">{{ truncateText(item.description, 80) }}</p>
                <div class="card-meta">
                    <p>Ends: {{ formatDate(item.end_date) }}</p>
                </div>
            </div>

            <div class="card-footer">
                <router-link :to="`/item/${item.item_id}`" class="view-btn">View Details and Bid</router-link>
                
                <button @click="openHistory(item.item_id)" class="history-btn">Bid History</button>
            </div>
        </div>
      </div>

      <div v-else class="no-results">
        <p>No items found matching "{{ searchQuery }}"</p>
      </div>
    </div>

    <BidHistoryModal 
        :isOpen="isModalOpen" 
        :itemId="selectedItemId" 
        @close="isModalOpen = false" 
    />
    </div>
</template>

<script>
  import { CoreService } from '@/services/core.service';
  import  BidHistoryModal from '@/views/components/BidHistoryModal.vue'

    export default {
    name: 'Home',
    components: {
      BidHistoryModal
    },
    data(){
      return {
        welcome_message: "Welcome to the Auctionable Marketplace",
        search_message: "Current Items for sale and to bid on!",
        items: [],  //Array to hold fetched items from server
        error: "",
        loading: true,
        searchQuery: "",
        isModalOpen: false,
        selectedItemId: 0
      }
    }, 
    computed: {
      filteredItems() {
        if(!this.searchQuery) {
          return this.items;
        }
        const lowerQuery = this.searchQuery.toLowerCase();

        return this.items.filter(item => 
          item.name.toLowerCase().includes(lowerQuery) || 
          item.description.toLowerCase().includes(lowerQuery)
        );
      }
    },
    mounted(){
      CoreService.searchItems()
      .then(items => {
        this.items = items;
        this.loading = false;
      })
      .catch(err => {
        this.error = err.message || "Failed to load items. Check the server console."; 
        this.loading = false;
      });
    },
    methods: {
      openHistory(id){
        this.selectedItemId = id;
        this.isModalOpen = true;
      },
      truncateText(text, length) {
        if(!text) {
          return '';
        }
        return text.length > length ? text.substring(0, length) + '...' : text;
      },
      formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
      }
    }
  }
</script>
<style scoped>
.home-wrapper {
  background-color: #f7f7f7; 
}

.home-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }

/* Search Style */
.search-bar {
    margin: 20px 0;
    text-align: center;
}
.search-bar input {
    width: 100%;
    max-width: 400px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 25px; /* Rounded pill shape */
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    outline: none;
    transition: border-color 0.3s;
}
.search-bar input:focus { border-color: #42b983; }

/* Grid Layout for Cards */
.item-grid {
    display: grid;
    /* Responsive grid: fits as many 280px cards as possible */
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    margin-top: 20px;
}

.item-card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
}

.item-card:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 10px 20px rgba(0,0,0,0.1); 
}

.card-header { 
    background: #f8f9fa; 
    padding: 15px; 
    border-bottom: 1px solid #eee; 
}
.card-header h3 { margin: 0 0 5px 0; font-size: 1.25rem; color: #2c3e50; }
.seller-tag { font-size: 0.85rem; color: #888; font-style: italic; }

.card-body { padding: 15px; flex-grow: 1; }
.description { font-size: 0.95rem; color: #555; line-height: 1.4; }
.card-meta { margin-top: 15px; font-weight: bold; color: #42b983; font-size: 0.9rem; }

.card-footer {
    padding: 10px;
    background: white;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
}

/* Button Styles */
.view-btn, .history-btn {
  flex: 1;
    text-align: center;
    padding: 10px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;
    text-decoration: none;
    font-weight: 500;
}

.view-btn { 
    background-color: #42b983; 
    color: white; 
}
.view-btn:hover { background-color: #3aa876; }

.history-btn { 
    background-color: #eef2f5; 
    color: #2c3e50; 
}
.history-btn:hover { background-color: #dbe2e8; }

.auth-options { display: flex; gap: 1rem; justify-content: flex-end; margin-bottom: 2rem; }
.auth-btn { padding: 0.5rem 1rem; background-color: #42b983; color: white; border: none; border-radius: 4px; text-decoration: none; }
.auth-btn.secondary { background-color: #2c3e50; }
.no-results { text-align: center; padding: 2rem; color: #777; }
.error-msg { color: #d9534f; text-align: center; }
</style>