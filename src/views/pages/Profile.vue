<template>
  <div class="profile-page-wrapper">
    <div class="profile-container">
      <div v-if="loading" class="loading-state">Loading Profile...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>

      <div v-else>
        <!-- Profile Header -->
        <div class="profile-header-card">
          <div class="profile-info">
            <h1>{{ profile?.first_name }} {{ profile?.last_name }}</h1>
            <p class="user-subtitle">Member ID: {{ profile?.user_id }}</p>
          </div>
          <button
            @click="showSellModal = true"
            class="btn btn-primary create-listing-btn"
          >
            + Create New Listing
          </button>
        </div>

        <!-- Tab Navigation -->
        <div class="profile-tabs">
          <button
            @click="activeTab = 'selling'"
            :class="['tab-btn', { active: activeTab === 'selling' }]"
          >
            My Listings ({{ myItems.length }})
          </button>
          <button
            @click="activeTab = 'bidding'"
            :class="['tab-btn', { active: activeTab === 'bidding' }]"
          >
            Active Bids ({{ profile?.bidding_on?.length || 0 }})
          </button>
          <button
            @click="activeTab = 'ended'"
            :class="['tab-btn', { active: activeTab === 'ended' }]"
          >
            Ended Auctions ({{ profile?.auctions_ended?.length || 0 }})
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- My Listings Tab -->
          <div v-if="activeTab === 'selling'" class="listings-section">
            <div v-if="myItems.length === 0" class="empty-state">
              <p>You haven't listed any items yet.</p>
              <button @click="showSellModal = true" class="btn btn-outline">
                Create Your First Listing
              </button>
            </div>
            <div v-else class="items-grid">
              <div
                v-for="item in myItems"
                :key="item.item_id"
                class="listing-card"
              >
                <div class="listing-header">
                  <h3>{{ item.name }}</h3>
                  <span class="bid-badge"
                    >Current Bid: £{{
                      item.current_bid || item.starting_bid
                    }}</span
                  >
                </div>
                <p class="listing-description">{{ item.description }}</p>
                <p class="listing-meta">
                  Ends: {{ formatDate(item.end_date) }}
                </p>

                <!-- Questions Section -->
                <div
                  v-if="item.questions && item.questions.length > 0"
                  class="questions-section"
                >
                  <h4>Questions ({{ item.questions.length }})</h4>
                  <div
                    v-for="q in item.questions"
                    :key="q.question_id"
                    class="question-item"
                  >
                    <div class="question-text">
                      <strong>Q:</strong> {{ q.question_text }}
                    </div>
                    <div v-if="q.answer_text" class="answer-text">
                      <strong>A:</strong> {{ q.answer_text }}
                    </div>
                    <div v-else class="answer-form">
                      <textarea
                        v-model="pendingAnswers[q.question_id]"
                        placeholder="Type your answer..."
                        rows="2"
                      ></textarea>
                      <button
                        @click="submitAnswer(q.question_id)"
                        class="btn btn-small"
                        :disabled="!pendingAnswers[q.question_id]"
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="no-questions">
                  <em>No questions yet</em>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Bids Tab -->
          <div v-if="activeTab === 'bidding'" class="bids-section">
            <div
              v-if="!profile?.bidding_on || profile.bidding_on.length === 0"
              class="empty-state"
            >
              <p>You haven't placed any bids yet.</p>
              <router-link to="/" class="btn btn-outline"
                >Browse Auctions</router-link
              >
            </div>
            <div v-else class="items-grid">
              <div
                v-for="item in profile.bidding_on"
                :key="item.item_id"
                class="bid-card"
              >
                <h3>{{ item.name }}</h3>
                <p class="listing-description">{{ item.description }}</p>
                <p class="listing-meta">
                  Seller: {{ item.first_name }} {{ item.last_name }}
                </p>
                <p class="listing-meta">
                  Ends: {{ formatDate(item.end_date) }}
                </p>
                <router-link
                  :to="`/item/${item.item_id}`"
                  class="btn btn-outline"
                  >View Item</router-link
                >
              </div>
            </div>
          </div>

          <!-- Ended Auctions Tab -->
          <div v-if="activeTab === 'ended'" class="ended-section">
            <div
              v-if="
                !profile?.auctions_ended || profile.auctions_ended.length === 0
              "
              class="empty-state"
            >
              <p>No ended auctions yet.</p>
            </div>
            <div v-else class="items-grid">
              <div
                v-for="item in profile.auctions_ended"
                :key="item.item_id"
                class="ended-card"
              >
                <h3>{{ item.name }}</h3>
                <p class="listing-description">{{ item.description }}</p>
                <p class="listing-meta ended-badge">Auction Ended</p>
                <p class="listing-meta">
                  Ended: {{ formatDate(item.end_date) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Listing Modal -->
    <div
      v-if="showSellModal"
      class="modal-overlay"
      @click.self="showSellModal = false"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create New Listing</h2>
          <button class="close-btn" @click="showSellModal = false">×</button>
        </div>
        <form @submit.prevent="handleCreateItem" class="sell-item-form">
          <div class="form-group">
            <label>Item Name</label>
            <input
              v-model="newItem.name"
              type="text"
              required
              placeholder="Enter item name"
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="newItem.description"
              required
              placeholder="Describe your item"
              rows="4"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Starting Price (£)</label>
              <input
                v-model.number="newItem.starting_bid"
                type="number"
                required
                placeholder="0"
              />
            </div>

            <div class="form-group">
              <label>Auction Ends On</label>
              <input
                v-model="newItem.end_date_raw"
                type="datetime-local"
                required
              />
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="showSellModal = false"
              class="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { UserService } from "@/services/user.service";
import { CoreService } from "@/services/core.service";
import { QuestionService } from "@/services/question.service";

export default {
  name: "Profile",
  data() {
    return {
      profile: null,
      loading: true,
      error: null,
      activeTab: "selling",
      myItems: [],
      pendingAnswers: {},
      showSellModal: false,
      newItem: { name: "", description: "", starting_bid: 0, end_date_raw: "" },
    };
  },
  async created() {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      this.error = "Please log in to view your profile.";
      this.loading = false;
      return;
    }

    try {
      this.profile = await UserService.getUserProfile(userId);
      await this.fetchMyItems();
    } catch (err) {
      this.error = "Failed to load profile data.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchMyItems() {
      const userId = localStorage.getItem("user_id");
      try {
        const allItems = await CoreService.searchItems();
        this.myItems = allItems.filter((item) => item.creator_id == userId);

        for (let item of this.myItems) {
          const qs = await QuestionService.getQuestionsForItem(item.item_id);
          item.questions = qs;
        }
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    },

    handleCreateItem() {
      const unixEnd = Math.floor(
        new Date(this.newItem.end_date_raw).getTime() / 1000
      );

      const payload = {
        name: this.newItem.name,
        description: this.newItem.description,
        starting_bid: this.newItem.starting_bid,
        end_date: unixEnd,
      };

      CoreService.createItem(payload)
        .then(() => {
          alert("Listing created successfully!");
          this.newItem = {
            name: "",
            description: "",
            starting_bid: 0,
            end_date_raw: "",
          };
          this.showSellModal = false;
          this.activeTab = "selling";
          this.fetchMyItems();
        })
        .catch((err) => alert("Error creating listing: " + err));
    },

    submitAnswer(qId) {
      const answerText = this.pendingAnswers[qId];
      if (!answerText) {
        return;
      }
      QuestionService.answerQuestion(qId, answerText)
        .then(() => {
          alert("Answer posted successfully!");
          this.pendingAnswers[qId] = "";
          this.fetchMyItems();
        })
        .catch((err) => alert("Error posting answer: " + err.message));
    },

    formatDate(timestamp) {
      if (!timestamp) return "N/A";
      return new Date(timestamp).toLocaleString("en-GB");
    },
  },
};
</script>

<style scoped>
.profile-page-wrapper {
  background-color: #f7f7f7;
  min-height: 100vh;
  padding: 40px 20px;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Profile Header Card */
.profile-header-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-info h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 2rem;
}

.user-subtitle {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.create-listing-btn {
  white-space: nowrap;
  padding: 12px 24px;
  font-size: 1rem;
}

/* Tab Navigation */
.profile-tabs {
  display: flex;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #f0f0f0;
  color: #2c3e50;
}

.tab-btn.active {
  background: #42b983;
  color: white;
}

/* Tab Content */
.tab-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-height: 400px;
}

/* Items Grid */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

/* Listing Cards */
.listing-card,
.bid-card,
.ended-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.listing-card:hover,
.bid-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.listing-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.listing-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
  flex: 1;
}

.bid-badge {
  background: #42b983;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 10px;
}

.ended-badge {
  background: #888;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  display: inline-block;
}

.listing-description {
  color: #555;
  margin: 10px 0;
  line-height: 1.5;
}

.listing-meta {
  color: #888;
  font-size: 0.9rem;
  margin: 5px 0;
}

/* Questions Section */
.questions-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.questions-section h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.question-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid #42b983;
}

.question-text {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.answer-text {
  color: #555;
  padding-left: 15px;
  font-size: 0.95rem;
}

.answer-form {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.answer-form textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
  font-size: 0.95rem;
}

.answer-form textarea:focus {
  outline: none;
  border-color: #42b983;
}

.btn-small {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  font-size: 0.9rem;
}

.btn-small:hover {
  background: #359268;
}

.btn-small:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.no-questions {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

.empty-state p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

/* Modal Styles */
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
  padding: 0;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 2px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2.5rem;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #42b983;
}

/* Form Styles */
.sell-item-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b983;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* Loading and Error States */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  font-size: 1.2rem;
  color: #666;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  text-align: center;
}

/* Button Styles */
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  border: 2px solid transparent;
  font-size: 1rem;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.btn-primary:hover {
  background-color: #359268;
  border-color: #359268;
}

.btn-outline {
  background-color: white;
  color: #42b983;
  border-color: #42b983;
}

.btn-outline:hover {
  background-color: #f0f0f0;
}
</style>
