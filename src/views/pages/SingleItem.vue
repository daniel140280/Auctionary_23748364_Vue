<template>
    <div class="single-item-wrapper">
      <div class="single-item-container">
        <div class="nav-back"><router-link to="/" class="btn-back">← Back to All Listings</router-link>
        </div>

        <div v-if="loading" class="loading-state">Loading item details...</div>
        <div v-else-if="error" class="error-msg">{{ error }}</div>

        <div v-else class="content-layout">
        <!-- Main Content Column -->
          <div class="main-content">
            <!-- Item Header Card -->
            <div class="item-header-card">
              <h1>{{ item.name }}</h1>
              <p class="seller-info"><span class="label">Seller:</span>{{ item.first_name }} {{ item.last_name }}</p>
            </div>
  
            <!-- Description Card -->
            <div class="section-card">
              <h2 class="section-title">Description</h2>
              <p class="description-text">{{ item.description }}</p>
            </div>
  
            <!-- Auction Details Card -->
            <div class="section-card">
              <h2 class="section-title">Auction Details</h2>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Starting Bid</span>
                  <span class="detail-value">£{{ item.starting_bid }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Auction Started</span>
                  <span class="detail-value">{{
                    formatDate(item.start_date)
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Auction Ends</span>
                  <span class="detail-value">{{
                    formatDate(item.end_date)
                  }}</span>
                </div>
              </div>
            </div>
  
            <!-- Questions Section -->
            <div class="section-card">
              <div class="questions-header">
                <h2 class="section-title">Questions & Answers</h2>
                <select v-model="questionSortOrder" class="sort-dropdown">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="answered">Answered First</option>
                </select>
              </div>
  
              <div v-if="questions.length === 0" class="no-data">No questions yet. Be the first to ask!</div>
  
              <div v-else class="questions-list">
                <div
                  v-for="q in sortedQuestions"
                  :key="q.question_id"
                  class="question-card"
                >
                  <div class="question-content">
                    <strong>Q:</strong> {{ q.question_text }}
                  </div>
                  <div v-if="q.answer_text" class="answer-content">
                    <strong>A:</strong> {{ q.answer_text }}
                  </div>
                  <div v-else class="no-answer">
                    <em>Awaiting seller response...</em>
                  </div>
                </div>
              </div>
  
              <div v-if="isLoggedIn && !isOwnItem" class="ask-question-form">
                <textarea
                  v-model="newQuestion"
                  placeholder="Ask the seller a question..."
                  rows="3"
                ></textarea>
                <button
                  @click="submitQuestion"
                  class="btn btn-primary"
                  :disabled="!newQuestion"
                >
                  Ask Question
                </button>
              </div>
              <div v-else-if="!isLoggedIn" class="login-prompt">
                <router-link to="/login">Login</router-link> to ask questions
              </div>
            </div>
          </div>

          <!-- Sidebar Column -->
          <div class="sidebar">
            <!-- Bidding Card -->
            <div class="bid-card">
              <div class="current-bid-display">
                <span class="bid-label">Current Bid</span>
                <span class="bid-amount"
                  >£{{ item.current_bid || item.starting_bid }}</span
                >
                <div v-if="item.current_bid_holder" class="bid-holder">
                  Currently held by {{ item.current_bid_holder.first_name }}
                  {{ item.current_bid_holder.last_name }}
                </div>
                <div v-else class="bid-holder-empty">
                  No bids yet - be the first!
                </div>
              </div>
  
              <div
                v-if="bidStatus.message"
                :class="['bid-status', bidStatus.type]"
              >
                {{ bidStatus.message }}
              </div>
  
              <div v-if="isLoggedIn && !isOwnItem" class="bid-form">
                <label class="bid-label-small">Your Bid (£)</label>
                <input
                  type="number"
                  v-model.number="newBidAmount"
                  :min="minNextBid"
                  class="bid-input"
                />
                <button
                  @click="submitBid"
                  class="btn btn-primary btn-full"
                  :disabled="isPlacingBid"
                >
                  {{ isPlacingBid ? "Placing Bid..." : "Place Bid" }}
                </button>
              </div>
              <div v-else-if="isOwnItem" class="owner-notice">
                <p>This is your listing</p>
              </div>
              <div v-else class="login-notice">
                <p><router-link to="/login">Login</router-link> to place a bid</p>
              </div>
  
              <div class="auction-meta">
                <div class="meta-item">
                  <span class="meta-label">Closes:</span>
                  <span class="meta-value">{{ formatDate(item.end_date) }}</span>
                </div>
              </div>
  
              <button
                @click="isModalOpen = true"
                class="btn btn-outline btn-full"
              >
                View Bid History
              </button>
            </div>
          </div>
        </div>
  
        <BidHistoryModal
          :isOpen="isModalOpen"
          :itemId="item?.item_id"
          @close="isModalOpen = false"
        />
      </div>
    </div>
  </template>

<script>
import { CoreService } from "@/services/core.service";
import { QuestionService } from "@/services/question.service";
import  BidHistoryModal from "@/views/components/BidHistoryModal.vue";

export default {
    name: "SingleItem",
    components: { BidHistoryModal },
    data(){
        return {
            item: null,
            questions: [],
            newQuestion: "",
            questionSortOrder: "newest",
            modalKey: 0,
            error: "",
            loading: true,
            isModalOpen: false,
            newBidAmount: null,
            isPlacingBid: false,
            bidStatus: { message: "", type: "" },
            currentUserId: parseInt(localStorage.getItem("user_id")),
            };
        },
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem("session_token");
        },
        isOwnItem() {
            if (!this.item || !this.isLoggedIn) return false;
            return this.item.creator_id === this.currentUserId;
        },
        minNextBid() {
            if (!this.item) return 1;
            const currentHighest = this.item.current_bid || this.item.starting_bid;
            return currentHighest + 1;
        },
        sortedQuestions() {
            let qs = [...this.questions];
            if (this.questionSortOrder === "newest") {
                return qs.sort((a, b) => b.question_id - a.question_id);
            } else if (this.questionSortOrder === "oldest") {
                return qs.sort((a, b) => a.question_id - b.question_id);
            } else if (this.questionSortOrder === "answered") {
                return qs.sort(
                (a, b) => (b.answer_text ? 1 : 0) - (a.answer_text ? 1 : 0)
                );
            }
            return qs;
            },
        },
    mounted() {
        this.fetchItemDetails();
    },
    methods: {
    fetchItemDetails() {
        this.loading = true;

        CoreService.searchSingleItems(this.$route.params.item_id)
        .then((data) => {
            this.item = Array.isArray(data) ? data[0] : data;

            if (!this.item) {
            this.error = "Item not found.";
            return;
          }
          this.newBidAmount = this.minNextBid;
          this.modalKey++;
          this.fetchQuestions();
        })
        .catch((err) => {
            this.error = err.message || "Item details failed to load. Please check the ID.";
        })
        .finally(() => {
            this.loading = false;
        });
    },
    fetchQuestions() {
        QuestionService.getQuestionsForItem(this.$route.params.item_id)
            .then(data => {
                this.questions = data;
            })
            .catch(err => console.error("Encountered error fetching questions:", err));
    },
    submitQuestion() {
        if (!this.newQuestion.trim()) {
            return;
        }

        QuestionService.askQuestion(this.item.item_id, this.newQuestion)
            .then(() => {
            this.newQuestion = "";
            this.fetchQuestions();
            alert("Question submitted!");
            })
            .catch((err) => {
            alert("Could not post question: " + err.message);
            });
    },
    submitBid() {
        if (this.isOwnItem) {
            return;
        }
        this.isPlacingBid = true;
        CoreService.placeBid(this.item.item_id, this.newBidAmount)
            .then(() => {
            this.setBidStatus(`Bid placed successfully!`, "success");
            this.fetchItemDetails();
            })
            .catch((err) => {
            this.setBidStatus(err.message, "error");
            })
            .finally(() => {
            this.isPlacingBid = false;
            });
    },
    setBidStatus(message, type) {
        this.bidStatus = { message, type };
        setTimeout(() => {
            this.bidStatus = { message: "", type: "" };
        }, 5000);
    },
    formatDate(timestamp) {
        if (!timestamp) return "N/A";
        return new Date(timestamp).toLocaleString("en-GB");
    },
},
};
</script>

<style scoped>
.single-item-wrapper {
    background-color: #f7f7f7;
    min-height: 100vh;
    padding: 20px;
}
.single-item-container {
    max-width: 1400px;
    margin: 0 auto;
}
/* Navigation */
.nav-back {
    margin-bottom: 25px;
}
.btn-back {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    background: white;
    color: #2c3e50;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}
.btn-back:hover {
    background: #42b983;
    color: white;
    transform: translateX(-5px);
}

/* Content Layout */
.content-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 30px;
    align-items: start;
}
/* Main Content */
.main-content {
    display: flex;
    flex-direction: column;
    gap: 25px;
}
/* Card Styles */
.item-header-card,
.section-card,
.bid-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.item-header-card h1 {
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 2.2rem;
    line-height: 1.2;
}
.seller-info {
    color: #666;
    font-size: 1.1rem;
    margin: 0;
}
.seller-info .label {
    font-weight: 600;
    color: #888;
}
/* Section Styles */
.section-title {
    margin: 0 0 20px 0;
    color: #2c3e50;
    font-size: 1.5rem;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
}
.description-text {
    color: #555;
    line-height: 1.8;
    font-size: 1.05rem;
    margin: 0;
}
/* Details Grid */
.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}
.detail-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.detail-label {
    font-size: 0.9rem;
    color: #888;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.detail-value {
    font-size: 1.2rem;
    color: #2c3e50;
    font-weight: 600;
}
/* Questions Section */
.questions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.questions-header .section-title {
    margin: 0;
    border: none;
    padding: 0;
}
.sort-dropdown {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #555;
    cursor: pointer;
}
.questions-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.question-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid #42b983;
}
.question-content {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 1rem;
    line-height: 1.6;
}
.answer-content {
    color: #555;
    padding-left: 20px;
    border-left: 3px solid #e0e0e0;
    font-size: 1rem;
    line-height: 1.6;
}
.no-answer {
    color: #999;
    font-style: italic;
    padding-left: 20px;
}
.no-data {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    font-style: italic;
}
/* Ask Question Form */
.ask-question-form {
    margin-top: 25px;
    padding-top: 25px;
    border-top: 2px solid #f0f0f0;
    display: flex;
    gap: 15px;
    flex-direction: column;
}
.ask-question-form textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}
.ask-question-form textarea:focus {
    outline: none;
    border-color: #42b983;
}
/* Sidebar */
.sidebar {
    position: sticky;
    top: 20px;
}
/* Bid Card */
.bid-card {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.current-bid-display {
    text-align: center;
    padding: 25px;
    background: linear-gradient(135deg, #42b983 0%, #359268 100%);
    border-radius: 10px;
    color: white;
}
.bid-label {
    display: block;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.9;
    margin-bottom: 10px;
}
.bid-amount {
    display: block;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 10px;
}
.bid-holder {
    font-size: 0.95rem;
    opacity: 0.9;
}
.bid-holder-empty {
    font-size: 0.95rem;
    opacity: 0.9;
    font-style: italic;
}
/* Bid Form */
.bid-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.bid-label-small {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.95rem;
}
.bid-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}
.bid-input:focus {
    outline: none;
    border-color: #42b983;
}
/* Bid Status */
.bid-status {
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 600;
    text-align: center;
}
.bid-status.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}
.bid-status.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
/* Notices */
.owner-notice,
.login-notice {
    text-align: center;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    color: #666;
}
.owner-notice p,
.login-notice p {
    margin: 0;
    font-weight: 600;
}
/* Auction Meta */
.auction-meta {
    padding: 15px 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
}
.meta-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.meta-label {
    color: #888;
    font-weight: 600;
}
.meta-value {
    color: #2c3e50;
    font-weight: 600;
}
/* Buttons */
.btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    font-size: 1rem;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    box-sizing: border-box;
}
.btn-primary {
    background: #42b983;
    color: white;
    border-color: #42b983;
}
.btn-primary:hover:not(:disabled) {
    background: #359268;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}
.btn-primary:disabled {
    background: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
    transform: none;
}
.btn-outline {
    background: white;
    color: #42b983;
    border-color: #42b983;
}
.btn-outline:hover {
    background: #f0f0f0;
}
.btn-full {
    width: 100%;
}
/* Login Prompt */
.login-prompt {
    text-align: center;
    padding: 20px;
    color: #666;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 20px;
}
.login-prompt a {
    color: #42b983;
    font-weight: 600;
    text-decoration: none;
}
.login-prompt a:hover {
    text-decoration: underline;
}
/* Loading and Error States */
.loading-state {
    text-align: center;
    padding: 60px 20px;
    font-size: 1.2rem;
    color: #666;
}
.error-msg {
    background: #f8d7da;
    color: #721c24;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #f5c6cb;
    text-align: center;
}
/* Responsive */
@media (max-width: 1024px) {
.content-layout {
    grid-template-columns: 1fr;
}
.sidebar {
    position: static;
}
}
</style>