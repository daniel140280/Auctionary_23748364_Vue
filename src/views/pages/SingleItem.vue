<template>
  <div>
      <h1>{{item_details}}</h1>
      <p>So, you want to know more about this special piece?</p> 
      <em v-if="loading">Loading item details...</em>
      <div v-else-if="item">
          <h2>{{ item.name }}</h2>
          <p><strong>Description:</strong> {{ item.description }}</p>
          <p><strong>Starting Bid:</strong> £{{ item.starting_bid }}</p>
          <p><strong>Current Bid:</strong> £{{ item.current_bid || item.starting_bid }}</p>
          <p><strong>Auction Ends:</strong> {{ new Date(item.end_date * 1000).toLocaleString() }}</p>
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