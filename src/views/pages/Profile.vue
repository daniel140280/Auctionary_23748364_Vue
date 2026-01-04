// views/pages/Profile.vue
<template>
    <div class="profile-container">
        <h2 v-if="loading" class="text-center">Loading Profile...</h2>
        <div v-else-if="error" class="error-message text-center">{{ error }}</div>
        
    <h1>Member Profile</h1>
    
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
            <textarea v-model="newItem.description"></textarea>

            <label>Start Price (£):</label>
            <input type="number" v-model.number="newItem.starting_bid" required />

            <label>Ends On:</label>
            <input type="datetime-local" v-model="newItem.end_date_raw" required />

            <span></span> <button class="btn btn-primary">Launch for Sale</button>
        </form>
    </div>

    <div v-if="tab === 'selling'" class="tab-content">
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
</template>

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
            this.error = "User ID not found in local storage. Please log in.";
            this.loading = false;
            return;
        }

        try {
            this.profile = await UserService.getUserProfile(userId);
        } catch (err) {
            this.error = typeof err === 'string' ? err : "Failed to load profile data.";
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
                    this.tab = 'selling';
                    this.fetchMyItems();
                })
                .catch(err => alert(err));
        },
        fetchMyItems() {
            const userId = localStorage.getItem('user_id');
            CoreService.searchItems()
                .then(allItems => {
                    this.myItems = allItems.filter(item => item.creator_id == userId);
                        this.myItems.forEach(item => {
                        QuestionService.getQuestionsForItem(item.item_id)
                            .then(qs => {
                                item.questions = qs;
                            });
                    });
                });
        },
        submitAnswer(qId) {
            const answerText = this.pendingAnswers[qId];
            if(!text) {
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
    },
    mounted() {
        this.fetchMyItems();
    }
}
</script>

<style scoped>
.profile-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
}

.profile-card {
    background: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    padding: 2rem;
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