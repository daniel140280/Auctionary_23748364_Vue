<template>
    <div class="single-item-container">

    <div class="nav-back"><router-link to="/" class="btn-outline">← Back to All Listings</router-link></div>

    <div v-if="loading" class="text-center">Loading item...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>

    <div class="main-layout-grid">
        <div class="details-column">
            <section class="item-header">
                <h1>{{ item.name }}</h1>
                <p class="subtitle">Seller: {{ item.first_name }} {{ item.last_name }}</p>
            </section>

            <section class="description-section">
                <h3>Description</h3>
                <p>{{ item.description }}</p>
            </section>

            <section class="questions-section">
                    <div class="questions-header">
                        <h3>Questions & Answers</h3>
                        <div class="sort-controls">
                            <label>Sort:</label>
                            <select v-model="questionSortOrder">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="answered">Answered First</option>
                            </select>
                        </div>
                    </div>

                    <div v-if="questions.length === 0" class="no-data">No questions yet.</div>
                    
                    <div v-for="q in sortedQuestions" :key="q.question_id" class="question-card">
                        <p class="question-text"><strong>Q:</strong> {{ q.question_text }}</p>
                        <p class="answer-text" v-if="q.answer_text"><strong>A:</strong> {{ q.answer_text }}</p>
                        <p class="no-answer" v-else><em>Awaiting seller response...</em></p>
                    </div>

                    <div v-if="isLoggedIn && !isOwnItem" class="ask-box">
                        <textarea v-model="newQuestion" placeholder="Ask the seller a question..."></textarea>
                        <button @click="submitQuestion" class="btn btn-primary" :disabled="!newQuestion">Ask Question</button>
                    </div>
                </section>
        </div>

        <div class="sidebar-column">
                <div class="bid-card">
                    <div class="stat">
                        <label>Current Bid</label>
                        <div class="price">£{{ item.current_bid || item.starting_bid }}</div>
                    </div>
                    
                    <div v-if="bidStatus.message" :class="['bid-status', bidStatus.type]">
                        {{ bidStatus.message }}
                    </div>

                    <div class="bid-form">
                        <input type="number" v-model.number="newBidAmount" :min="minNextBid" />
                        <button @click="submitBid" class="btn btn-primary full-width" :disabled="isPlacingBid || isOwnItem">
                            {{ getBidButtonText }}
                        </button>
                    </div>

                    <div class="auction-meta">
                        <p><strong>Starts:</strong> {{ formatDate(item.start_date) }}</p>
                        <p><strong>Closes:</strong> {{ formatDate(item.end_date) }}</p>
                    </div>

                    <button @click="isModalOpen = true" class="btn-link">View Bid History</button>
                </div>
            </div>
        </div>

    <BidHistoryModal
        :key="modalKey" 
        :isOpen="isModalOpen" 
        :itemId="item ? item.item_id : null" 
        @close="isModalOpen = false" 
    />
</div>
</template>

<script>
import { CoreService } from '@/services/core.service';
import { QuestionService } from '@/services/question.service';
import  BidHistoryModal from '@/views/components/BidHistoryModal.vue'

export default {
    name: 'SingleItem',
    components: {BidHistoryModal},
data(){
    return {
        item: null,
        questions: [],
        newQuestion: "",
        questionSortOrder: 'newest',
        modalKey: 0,
        error: "",
        loading: true,
        isModalOpen: false,
        newBidAmount: null,
        isPlacingBid: false,
        bidStatus: { message: '', type: '' },
        currentUserId: parseInt(localStorage.getItem('user_id'))
    }
},
computed: {
    isLoggedIn() {
        return !!localStorage.getItem('session_token');
    },
    isOwnItem() {
        if (!this.item || !this.isLoggedIn) return false;
        return this.item.creator_id === this.currentUserId; 
    },
    // currentBidDisplay() {
    //     return this.item ? (this.item.current_bid || this.item.starting_bid) : '---';
    // },
    minNextBid() {
        if (!this.item) return 1;
        const currentHighest = this.item.current_bid || this.item.starting_bid;
        return currentHighest + 1;
    },
    getBidButtonText() {
        if (this.isPlacingBid) return 'Placing Bid...';
        if (this.isOwnItem) return 'Cannot bid on your own item)';
        return 'Place Bid';
    },
    sortedQuestions() {
        let qs = [...this.questions];
        if (this.questionSortOrder === 'newest') {
            return qs.sort((a, b) => b.question_id - a.question_id);
        } else if (this.questionSortOrder === 'oldest') {
            return qs.sort((a, b) => a.question_id - b.question_id);
        } else if (this.questionSortOrder === 'answered') {
            return qs.sort((a, b) => (b.answer_text ? 1 : 0) - (a.answer_text ? 1 : 0));
        }
        return qs;
    }
},
mounted(){
    this.fetchItemDetails();
},
methods: {
    fetchItemDetails() {
        this.loading = true;

        CoreService.searchSingleItems(this.$route.params.item_id)
        .then(data => {
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
            .catch(err => {
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
                this.setBidStatus(`Bid placed!`, 'success');
                this.fetchItemDetails(); 
            })
            .catch(err => { this.setBidStatus(err.message, 'error'); })
            .finally(() => { this.isPlacingBid = false; });
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
.main-layout-grid {
    display: grid;
    grid-template-columns: 1fr 350px; /* Two columns */
    gap: 30px;
    align-items: start;
}
.sidebar-column {
    position: sticky;
    top: 20px;
}
.bid-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #dee2e6;
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

.bid-input-group input:focus { border-color: #42b983; }
.bid-input-group input:disabled { background-color: #eee; cursor: not-allowed; }

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

.bid-btn:hover { background-color: #3aa876; }

.history-btn:hover { background-color: #3e5064; }
.question-card {
    background: #fff;
    border-left: 4px solid #42b983;
    padding: 10px 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.ask-box { width: 100%; height: 80px; margin-top: 20px; }
</style>