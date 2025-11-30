<template>
    <div>
         <!-- Home page has its own content -->
        <h1>{{welcome_message}}</h1>
        <p>This is the home page. Use the navigation links to go to different pages.</p>    
    </div>
</template>

<script>
    export default {
    name: 'Home',
    data(){
      //Home specific data - a function which returns an object. 
      //This object contains all of the data relevant to the component.
      return {
        welcome_message: "Auctionable - Welcome to the Auctionable App",
      }
    }, 
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