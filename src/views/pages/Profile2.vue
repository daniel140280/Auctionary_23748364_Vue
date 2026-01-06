// views/pages/Profile.vue
<template>
    <div class="profile-container">
        <h2 v-if="loading" class="text-center">Loading Profile...</h2>
        <div v-else-if="error" class="error-message text-center">{{ error }}</div>
        
        <div v-else class="profile-card">
            
            <header class="profile-header">
                <h3>Welcome, {{ profile.first_name }} {{ profile.last_name }}</h3>
                <p class="user-id">User ID: {{ profile.user_id }}</p>
            </header>

            <section class="create-item-section">
                <h2>List a New Item</h2>
                <form @submit.prevent="handleCreateItem">
                    <input v-model="newItem.name" placeholder="Item Name" required />
                    <textarea v-model="newItem.description" placeholder="Description"></textarea>
                    <input type="number" v-model="newItem.starting_bid" placeholder="Starting Price £" />
                    <label>Auction End Date:</label>
                    <input type="datetime-local" v-model="newItem.end_date" required />
                    <button type="submit">Launch Auction</button>
                </form>
            </section>

            <section class="seller-questions">
                <h2>Questions to Answer</h2>
                <div v-for="item in mySales" :key="item.id">
                    <h4>{{ item.name }}</h4>
                    <div v-for="q in item.unansweredQuestions" :key="q.id">
                        <p>{{ q.question_text }}</p>
                        <input v-model="answers[q.id]" placeholder="Type your answer..." />
                        <button @click="submitAnswer(q.id)">Send Answer</button>
                    </div>
                </div>
            </section>
            
            <div class="profile-section">
                <h4>Items You Are Selling ({{ profile.selling.length }})</h4>
                <ul class="item-list" v-if="profile.selling.length">
                    <li v-for="item in profile.selling" :key="item.item_id">
                        <router-link :to="`/item/${item.item_id}`">{{ item.name }}</router-link>
                    </li>
                </ul>
                <p v-else class="no-items">You have no active listings.</p>
            </div>

            <div class="profile-section">
                <h4>Items You Are Bidding On ({{ profile.bidding_on.length }})</h4>
                <ul class="item-list" v-if="profile.bidding_on.length">
                    <li v-for="item in profile.bidding_on" :key="item.item_id">
                        <router-link :to="`/item/${item.item_id}`">{{ item.name }}</router-link>
                    </li>
                </ul>
                <p v-else class="no-items">You are not currently bidding on any items.</p>
            </div>
            
            </div>
    </div>
</template>

<script>
import { UserService } from '@/services/user.service';

export default {
    name: 'Profile',
    data() {
        return {
            profile: null,
            loading: true,
            error: null
        }
    },
    // FIX 11: Call service on component creation
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