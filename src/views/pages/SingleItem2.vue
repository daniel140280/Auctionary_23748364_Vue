<template>
    <div>
        <h1>{{item_details}}</h1>
        <p>So, you want to know more about this special piece?</p> 
        <em v-if="loading">Loading item details...</em>
        <div v-else-if="item">
            <h2>{{ item.name }}</h2>
            <p><strong>Product selected: ID:</strong> {{ item.item_id }}</p>
            <p><strong>Description:</strong> {{ item.description }}</p>
            <p><strong>Creator ID:</strong> {{ item.creator_id }}</p>
            <p><strong>First Name:</strong> {{ item.first_name }}</p>
            <p><strong>Last Name:</strong> {{ item.last_name }}</p>
            <p><strong>Auction Ends:</strong> {{ new Date(item.end_date * 1000).toLocaleString() }}</p>
            <p><strong>Starting Bid:</strong> £{{ item.starting_bid }}</p>
            <p><strong>Current Bid:</strong> £{{ item.current_bid }}</p>
        </div>
        <div v-else-if="error">
            <p class="error-message">Error: {{ error }}</p>
        </div>
    </div>
  </template>
  <script>
    import { CoreService } from '@/services/core.service';
  
  export default {
  name: 'SingleItem',
  data(){
    return {
      item_details: "Item Details",
      item: null,
      error: "",
      loading: true
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
  
  }
  //object containing all of the relevant methods for our component
  }
  </script>
  <style scoped>
  div {
      padding: 2rem;
  }
  
  h1 {
      color: #42b983;
  }
  </style>

<template>
  <div class="single-item-container">

  <div class="nav-back"><router-link to="/" class="back-btn">← Back to All Listings</router-link></div>

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

      <div class="bid-form-section">
          <h3 class="form-title">Place Your Bid</h3>
          
          <p v-if="bidStatus.message" :class="['bid-status', bidStatus.type]">{{ bidStatus.message }}</p>

          <div class="bid-input-group">
              <input type="number" v-model.number="newBidAmount" :min="minNextBid" />
              <button @click="submitBid" class="bid-btn" :disabled="isPlacingBid || isOwnItem">{{ getBidButtonText }}</button>
          </div>
          
          <p class="login-prompt" v-if="!isLoggedIn">
              You must <router-link to="/login">login</router-link> to place a bid.
          </p>
          <p class="login-prompt owner-message" v-else-if="isOwnItem">
              You cannot bid on your own item.
          </p>
      </div>
      <div class="actions">
          <button @click="isModalOpen = true" class="history-btn">View Bid History</button>
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

//Helper function to support isOwnItem check
const getUserIdFromToken = () => {
  const token = localStorage.getItem('user_id');
};

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
  isModalOpen: false,
  newBidAmount: null,
  isPlacingBid: false,
  bidStatus: { message: '', type: '' },
  currentUserId: null
  }
},
computed: {
  isLoggedIn() {
      return !!localStorage.getItem('session_token');
  },
  currentBidDisplay() {
      return this.item ? (this.item.current_bid || this.item.starting_bid) : '---';
  },
  minNextBid() {
      if (!this.item) return 1;
      const currentHighest = this.item.current_bid || this.item.starting_bid;
      return currentHighest + 1;
  },
  isOwnItem() {
      if (!this.item || !this.isLoggedIn) return false;
      return this.item.creator_id === this.currentUserId; 
  },
  getBidButtonText() {
      if (this.isPlacingBid) return 'Placing Bid...';
      if (this.isOwnItem) return 'Cannot Bid (Your Item)';
      return 'Place Bid';
  }
},
mounted(){
  if (this.isLoggedIn) {
      this.currentUserId = getUserIdFromToken(); 
  }
  this.fetchItemDetails();
},
methods: {
  fetchItemDetails() {
      this.loading = true;
      const itemId = this.$route.params.item_id;

      CoreService.searchSingleItems(itemId)
      .then(data => {
          this.item = data;
          this.loading = false;
          this.newBidAmount = this.minNextBid; 
      })
      .catch((err) => {
          this.error = err.message || "Item details failed to load. Please check the ID.";
          this.loading = false;
      });
  },
  
  submitBid() {
      if (!this.isLoggedIn) {
          this.setBidStatus("Login if you wish to make a bid.", 'error');
          this.$router.push('/login');
          return;
      }

      if (this.isOwnItem) {
          this.setBidStatus("Users cannot bid on their own items.", 'error');
          return;
      }

      if (this.newBidAmount < this.minNextBid) {
          this.setBidStatus(`Bid too low, it must be at least £${this.minNextBid}.`, 'error');
          return;
      }
      
      this.isPlacingBid = true;
      this.bidStatus = { message: '', type: '' }; 
      
      CoreService.placeBid(this.item.item_id, this.newBidAmount)
          .then(() => {
              this.setBidStatus(`Bid of £${this.newBidAmount} placed successfully!`, 'success');
              // Remember to update current bid and bid holder
              this.fetchItemDetails(); 
          })
          .catch(error => {
              this.setBidStatus(error.message, 'error');
          })
          .finally(() => {
              this.isPlacingBid = false;
          });
  },
  setBidStatus(message, type) {
      this.bidStatus = { message, type };
      setTimeout(() => {
          this.bidStatus = { message: '', type: '' };
      }, 5000);
  },
  formatDate(timestamp) {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString('en-GB');
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

.bid-form-section {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 2rem;
  background-color: #fafafa;
  text-align: center;
}

.form-title {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 15px;
}

.bid-input-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.bid-input-group input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1.1rem;
  width: 250px;
  text-align: right;
  transition: border-color 0.2s;
}
.bid-input-group input:focus { border-color: #42b983; }
.bid-input-group input:disabled { background-color: #eee; cursor: not-allowed; }

.bid-input-group .bid-btn {
  padding: 12px 25px;
  font-size: 1.1rem;
  width: 150px;
  /* Reuse existing bid-btn styles */
}
.bid-input-group .bid-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.bid-status {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-weight: bold;
}

.bid-status.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.bid-status.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.login-prompt {
  margin-top: 15px;
  color: #888;
}

.login-prompt a {
  color: #42b983;
  font-weight: bold;
}
.owner-message {
  color: #d9534f;
  font-weight: bold;
}

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
</style>