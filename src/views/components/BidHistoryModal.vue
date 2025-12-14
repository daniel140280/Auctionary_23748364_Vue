//Reusable pop-up component to show bid history for an item
<template>
<div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Bid History for Item #{{ itemId }}</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="modal-body">
        
        <em v-if="loading">Loading bid history...</em>
        <p v-else-if="error" class="error-msg">{{ error }}</p>

        <div v-else-if="bids.length" class="history-list">
            
            <div class="list-header">
                <span class="col-price">Bid Amount</span>
                <span class="col-user">Bidder</span>
                <span class="col-time">Time Placed</span>
            </div>

            <div v-for="bid in bids" :key="bid.bid_id" class="history-row">
                <span class="col-price">£{{ bid.amount }}</span>
                <span class="col-user">{{ bid.first_name }} {{ bid.last_name }}</span>
                <span class="col-time">{{ formatTime(bid.timestamp) }}</span>
            </div>
            
        </div>

        <p v-else>
          No bids have been placed on this item yet.
        </p>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import { CoreService } from '@/services/core.service';
  
  export default {
    name: 'BidHistoryModal',
    props: {
      isOpen: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: Number,
      default: null 
    }
    },
    data() {
      return {
        bids: [],
        loading: false,
        error: null
      };
    },
    watch: {
      itemId: {
      immediate: true, // Run immediately when the component is created
      handler(newId) {
        if (newId) {
          this.fetchBidHistory(newId);
        } else {
          this.bids = []; // Clear bids if no item is selected
        }
      }
    }
  },
    methods: {
      fetchBidHistory(id) {
      this.loading = true;
      this.error = null;
      this.bids = [];

      CoreService.getBidHistory(id)
        .then(data => {
          this.bids = data;
          this.loading = false;
        })
        .catch(err => {
          this.error = err.message || "Could not retrieve bid history.";
          this.loading = false;
        });
    },
    closeModal() {
      this.$emit('close');
    },
    formatTime(timestamp) {
      return new Date(timestamp * 1000).toLocaleString();
    }
  }
};
  </script>
  
  <style scoped>
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-height: 80vh; 
  overflow-y: auto; 
}

/* Header and Close Button */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: 300;
  cursor: pointer;
  color: #aaa;
  line-height: 1;
  padding: 0 10px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #42b983;
}

/* Bid History Styling */
.modal-body {
  padding: 10px 0;
}

.history-list {
  display: grid;
  grid-template-columns: 1fr; 
}

.list-header, .history-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr; 
  padding: 10px 0;
  align-items: center;
}

.list-header {
  font-weight: bold;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}

.history-row {
  border-bottom: 1px dotted #eee;
  font-size: 0.95rem;
}

.history-row:nth-child(even) {
  background-color: #fafafa;
}

.col-price {
  font-weight: 600;
  color: #42b983; 
}

.col-user {
  color: #555;
}

.col-time {
  font-size: 0.85rem;
  color: #888;
}

.error-msg {
    color: #d9534f;
    text-align: center;
    padding: 15px;
    border: 1px solid #d9534f;
    background-color: #fceceb;
    border-radius: 4px;
}
  </style>