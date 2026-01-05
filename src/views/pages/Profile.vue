<template>
    <div class="profile-container">
        <h2 v-if="loading" class="text-center">Loading Profile...</h2>
        <div v-else-if="error" class="error-message text-center">{{ error }}</div>
        
        <div v-else>
            <h1>Member Profile: {{ profile?.first_name }}</h1>
    
            <div class="profile-tabs">
                <button @click="tab = 'buying'" :class="{active: tab === 'buying'}">My Bids</button>
                <button @click="tab = 'selling'" :class="{active: tab === 'selling'}">My Listings</button>
                <button @click="tab = 'create'" :class="{active: tab === 'create'}" class="create-tab">+ Sell Item</button>
            </div>

            <div v-if="tab === 'create'" class="tab-content">
                <h3>List an Item for Sale</h3>
                <form @submit.prevent="handleCreateItem" class="sell-item-form">
                <label>Item Name:</label>
                <input v-model="newItem.name" required />

                <label>Description:</label>
                <textarea v-model="newItem.description" required></textarea>

                <label>Start Price (£):</label>
                <input type="number" v-model.number="newItem.starting_bid" required />

                <label>Ends On:</label>
                <input type="datetime-local" v-model="newItem.end_date_raw" required />

                <button type="submit" class="btn btn-primary">Launch for Sale</button>
                </form>
            </div>

            <div v-if="tab === 'selling'" class="tab-content">
                <div v-if="myItems.length === 0" class="no-items">You haven't listed any items yet.</div>
                <div v-for="item in myItems" :key="item.item_id" class="seller-item-card">
                    <h4>{{ item.name }} (Current Bid: £{{ item.current_bid || item.starting_bid }})</h4>
                    
                    <div class="seller-questions">
                        <h5>Unanswered Questions:</h5>
                        <div v-for="q in item.questions" :key="q.question_id">
                        <div v-if="!q.answer_text" class="answer-box">
                            <p><strong>Q:</strong> {{ q.question_text }}</p>
                            <textarea v-model="pendingAnswers[q.question_id]" placeholder="Type answer..."></textarea>
                            <button @click="submitAnswer(q.question_id)">Submit Answer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<!-- <template>
    <div class="profile-page">
        <div class="profile-card">
            <h2>{{ user.first_name }}'s Profile</h2>
            <button @click="showSellForm = !showSellForm" class="btn-action">
            {{ showSellForm ? 'Cancel' : '+ Sell Item' }}
            </button>

            <div v-if="showSellForm" class="sell-form">
                <input v-model="newItem.name" placeholder="Item Name" class="custom-input">
                <textarea v-model="newItem.description" placeholder="Description" class="custom-textarea"></textarea>
                <div class="input-row">
                    <input type="number" v-model="newItem.starting_bid" placeholder="Start Price" class="custom-input half">
                    <input type="datetime-local" v-model="newItem.end_date" class="custom-input half">
                </div>
                <button @click="createListing" class="btn-submit">List Item</button>
            </div>
        </div>

        <div class="history-grid">
            <section class="history-block">
                <h3>My Listings (Selling)</h3>
            <div v-for="item in user.selling" :key="item.item_id" class="item-mini-card">
                <strong>{{ item.name }}</strong> - Ends: {{ new Date(item.end_date * 1000).toLocaleDateString() }}
            </div>
            </section>

            <section class="history-block">
                <h3>My Bids (Live)</h3>
                <div v-for="item in user.bidding_on" :key="item.item_id" class="item-mini-card">
                    <strong>{{ item.name }}</strong>
                </div>
            </section>

            <section class="history-block">
                <h3>Auctions Ended</h3>
                <div v-for="item in user.auctions_ended" :key="item.item_id" class="item-mini-card greyed">
                    <strong>{{ item.name }}</strong> (Finalized)
                </div>
            </section>
        </div>
    </div>
</template> -->

<script>
import { UserService } from '@/services/user.service';
import { CoreService } from '@/services/core.service';
import { QuestionService } from '@/services/question.service';

export default {
    name: 'Profile',
    data() {
        return {
            profile: null,
            loading: true,
            error: null,
            tab: 'buying',
            myItems: [],
            pendingAnswers: {},
            newItem: { name: '', description: '', starting_bid: 0, end_date_raw: '' }
        }
    },
    async created() {
        const userId = localStorage.getItem('user_id');
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
        handleCreateItem() {
            const unixEnd = Math.floor(new Date(this.newItem.end_date_raw).getTime() / 1000);
            
            const payload = {
                name: this.newItem.name,
                description: this.newItem.description,
                starting_bid: this.newItem.starting_bid,
                end_date: unixEnd
            };

            CoreService.createItem(payload)
                .then(() => {
                    alert("Listing created!");
                    this.newItem = { name: '', description: '', starting_bid: 0, end_date_raw: '' };
                    this.tab = 'selling';
                    this.fetchMyItems();
                })
                .catch(err => alert(err));
        },
        async fetchMyItems() {
            const userId = localStorage.getItem('user_id');
            try {
                const allItems = await CoreService.searchItems();
                this.myItems = allItems.filter(item => item.creator_id == userId);
                
                for (let item of this.myItems) {
                const qs = await QuestionService.getQuestionsForItem(item.item_id);
                item.questions = qs;
                }
            } catch (err) {
                console.error("Error fetching items:", err);
            }
        },
        submitAnswer(qId) {
            const answerText = this.pendingAnswers[qId];
            if(!answerText) {
                return;
            }
            QuestionService.answerQuestion(qId, answerText)
                .then(() => {
                    alert("Answer posted!");
                    this.pendingAnswers[qId] = '';
                    this.fetchMyItems();
                })
                .catch(err => alert(err));
        }
    }
    // mounted() {
    //     this.fetchMyItems();
    // }
}
</script>

<style scoped>
.profile-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
}

.profile-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    margin-bottom: 30px;
}

.profile-header {
    border-bottom: 2px solid #42b983;
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
}

.profile-tabs {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.custom-input, .custom-textarea {
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 8px; 
    font-family: inherit; 
    box-sizing: border-box;
}

.input-row { 
    display: flex; 
    gap: 10px; 
}

.half { 
    flex: 1; 
    height: 45px; 
} 

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.sell-item-form {
    display: grid;
    grid-template-columns: 140px 1fr; 
    gap: 15px;
    align-items: center; 
    background: white;
    padding: 30px;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.sell-item-form label {
    font-weight: bold;
    color: #2c3e50;
    text-align: right; 
}

.user-id {
    font-size: 0.9em;
    color: #666;
    margin-top: 0.5rem;
}

.profile-section h4 {
    color: #333;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    border-left: 4px solid #42b983;
    padding-left: 10px;
}

.item-list {
    list-style: none;
    padding: 0;
}

.item-list li {
    padding: 0.5rem 0;
    border-bottom: 1px dotted #eee;
}

.item-list a {
    color: #42b983;
    text-decoration: none;
}

.item-list a:hover {
    text-decoration: underline;
}

.no-items {
    font-style: italic;
    color: #999;
    padding-left: 14px;
}

</style>