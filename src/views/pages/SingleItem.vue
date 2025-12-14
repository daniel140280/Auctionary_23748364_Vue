<template>
  <div class="single-item-container">

    <div class="nav-back"><router-link to="/" class="back-btn">← Back to All Listings</router-link>
    </div>

      <em v-if="loading">Loading item details...</em>
      
      <div v-else-if="item" class="item-detail-card">
          <header>
            <h1>{{ item.name }}</h1>
            <p class="subtitle">Listed by {{ item.first_name }} {{ item.last_name }} (ID: {{ item.creator_id }})</p>
          </header>

          <div class="item-stats-grid">
              <div class="stat-box current">
                  <span class="label">Current Highest Bid</span>
                  <span class="value">£{{ item.current_bid }}</span>
                  <p v-if="item.current_bid_holder" class="bidder">
                    Currently held by: {{ item.current_bid_holder.first_name }} {{ item.current_bid_holder.last_name }}
                  </p>
                  <p v-else class="bidder">Be the first to bid!</p>
              </div>

              <div class="stat-box">
                  <span class="label">Starting Bid</span>
                  <span class="value starting">£{{ item.starting_bid }}</span>
              </div>
              
              <div class="stat-box">
                  <span class="label">Auction Closes</span>
                  <span class="value date">{{ formatDate(item.end_date) }}</span>
              </div>
               <div class="stat-box">
                  <span class="label">Started On</span>
                  <span class="value date">{{ formatDate(item.start_date) }}</span>
              </div>
          </div>

          <div class="description-section">
              <h3>Item Description</h3>
              <p>{{ item.description }}</p>
          </div>

          <div class="actions">
              <button @click="isModalOpen = true" class="history-btn">
                  View Bid History
              </button>
              <button class="bid-btn">Place Bid</button>
          </div>
      </div>

      <div v-else-if="error">
          <p class="error-message">Error: {{ error }}</p>
      </div>

      <BidHistoryModal 
        :isOpen="isModalOpen" 
        :itemId="item ? item.item_id : null" 
        @close="isModalOpen = false" 
    />
  </div>
</template>

<script>
  import { CoreService } from '@/services/core.service';
  import  BidHistoryModal from '@/views/components/BidHistoryModal.vue'

export default {
name: 'SingleItem',
components: {
  BidHistoryModal
},
data(){
  return {
    item_details: "Item Details",
    item: null,
    error: "",
    loading: true,
    isModalOpen: false
  }
}, 
mounted(){
  const itemId = this.$route.params.item_id; // Get item ID from route parameters
  //Code to run when component is mounted
  CoreService.searchSingleItems(itemId)
  .then(data => {
    this.item = data;
    this.loading = false;
  })
  .catch(err => {
    this.error = "Failed to load item details.";
    this.loading = false;
  });
},
methods: {
    formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    }
}}
</script>

<style scoped>
.single-item-container { padding: 2rem; max-width: 900px; margin: 0 auto; }

.nav-back {
    margin-bottom: 20px;
}

.back-btn {
    display: inline-block;
    color: #42b983;
    text-decoration: none;
    font-weight: 500;
    padding: 8px 15px;
    border: 1px solid #42b983;
    border-radius: 6px;
    transition: background-color 0.2s;
}
.back-btn:hover {
    background-color: #f0fff4;
}

.item-detail-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

h1 { color: #2c3e50; margin-bottom: 0.5rem; }
.subtitle { color: #888; font-style: italic; margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 10px;}

.item-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    margin-bottom: 2rem;
}

.stat-box { 
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    text-align: center;
    border: 1px solid #eee;
}

.stat-box.current {
    background-color: #e6ffed;
    border-color: #42b983;
    grid-column: span 2;
}

.label { 
    font-size: 0.85rem; 
    text-transform: uppercase; 
    color: #666; 
    margin-bottom: 5px;
}
.value { 
    font-size: 1.6rem; 
    font-weight: 700; 
    color: #2c3e50;
    margin-bottom: 5px;
}
.value.starting { color: #888; font-size: 1.2rem; }
.value.date { font-size: 1.1rem; }

.current .value { color: #42b983; font-size: 2rem; }
.bidder { font-size: 0.9rem; color: #555; }

.description-section { 
    margin-bottom: 3rem; 
    line-height: 1.7; 
    background: #ffffff;
    padding: 15px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
}
.description-section h3 { color: #42b983; margin-top: 0; }

.actions { 
    display: flex; 
    gap: 15px; 
    justify-content: center;
}
.history-btn, .bid-btn {
    padding: 15px 30px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition: background-color 0.3s;
}

.bid-btn {
    background-color: #42b983;
    color: white;
}
.bid-btn:hover { background-color: #3aa876; }

.history-btn {
    background-color: #2c3e50;
    color: white;
}
.history-btn:hover { background-color: #3e5064; }
.error-message { color: #d9534f; text-align: center; }
</style>