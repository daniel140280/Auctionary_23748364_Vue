<template>
  <div class="page-wrapper"> 
    <div class="content-container"> 

      <div class="auth-options">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="btn btn-primary">Login</router-link>
          <router-link to="/register" class="btn btn-secondary">Create Account</router-link>
        </template>
        <template v-else>
          <router-link to="/profile" class="btn btn-primary">My Profile</router-link>
          <button @click="handleLogout" class="btn btn-secondary">Logout</button>
        </template>
      </div>

      <div class="hero">
        <h1 v-if="isLoggedIn">Welcome Back to Auctionable!</h1>
        <h1 v-else>{{welcome_message}}</h1>
        <p>The premium auction house for high-end watches and jewellery.</p>
        
        <div class="search-bar-row">
          <input type="text" v-model="searchQuery" placeholder="Search items..."/>
          <select v-model="statusFilter" class="status-dropdown">
            <option value="all">All Items</option>
            <option value="open">Open Auctions</option>
            <option value="archive">Archive (Closed)</option>
            <option value="bid">Items I've Bid On</option>
          </select>
        </div>
      </div> 

      <div class="results-area">
        <h2 class="section-title">{{search_message}}</h2>

        <div v-if="filteredItems.length" class="item-grid">
          <div v-for="item in filteredItems" :key="item.item_id" class="item-card">
            <div class="card-header">
                <h3>{{ item.name }}</h3>
                <span class="seller-tag">by {{ item.first_name }} {{ item.last_name }}</span>
            </div>
            
            <div class="card-body" style="flex-grow: 1;">
                <p class="description">{{ truncateText(item.description, 80) }}</p>
                <div class="card-meta">
                    <p>Ends: {{ formatDate(item.end_date) }}</p>
                </div>
            </div>

            <div class="card-footer">
                <router-link :to="`/item/${item.item_id}`" class="btn btn-primary">View Details and Bid</router-link>
                <button @click="openHistory(item.item_id)" class="btn btn-primary">Bid History</button>
            </div>
          </div>
        </div>
      </div>

      <BidHistoryModal 
          :isOpen="isModalOpen" 
          :itemId="selectedItemId" 
          @close="isModalOpen = false" 
      />
    </div> 
  </div>
</template>

<script>
  import { CoreService } from '@/services/core.service';
  import { UserService } from '@/services/user.service';
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
        selectedItemId: 0, 
        isLoggedIn: !!localStorage.getItem('session_token'),
        statusFilter: 'all',
        currentUserId: parseInt(localStorage.getItem('user_id'))
      }
    }, 
    computed: {
      filteredItems() {
        let list = this.items;

        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            list = list.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
        }

        const now = Date.now();
        if (this.statusFilter === 'open') {
            list = list.filter(i => i.end_date > now);
        } else if (this.statusFilter === 'archive') {
            list = list.filter(i => i.end_date < now);
        } else if (this.statusFilter === 'bid') {
            list = list.filter(i => i.current_bidder_id === this.currentUserId);
        }
        return list;
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
        if (!timestamp) return "N/A";
        return new Date(timestamp).toLocaleString('en-GB');
      },
      handleLogout() {
        UserService.logout()
          .then(() => {
            localStorage.removeItem('session_token');
            localStorage.removeItem('user_id');
            this.isLoggedIn = false;
            this.$router.push('/login');
          })
          .catch(err => alert("Logout failed: " + err));
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
.history-btn {
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
.view-btn:hover { background-color: #3aa876; }

.history-btn:hover { background-color: #dbe2e8; }

.auth-options { display: flex; gap: 15px; justify-content: flex-end; margin: 20px; }
.auth-btn.secondary { background-color: #2c3e50; }
.no-results { text-align: center; padding: 2rem; color: #777; }
.error-msg { color: #d9534f; text-align: center; }
</style>