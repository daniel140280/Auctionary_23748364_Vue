<template>
    <div class="questions-page">
      <h1>Questions</h1>
      <div class="question-container">
        <div class="question-text">
            Topic: {{ question_text || 'No question text provided' }}
        </div>
        <div class="user-date">
        {{ question_user || 'Unknown user'}} - {{ question_date }}
        </div>
      </div>
    </div>
      <!-- Fetch questions from API
      <div v-if="questions.length > 0">
            <QuestionItem 
                v-for="question in questions" 
                :key="question.question_id"
                :question_text="question.question_text"
                :question_user="question.asked_by"
                :question_date="question.created_at"
            />
        </div>
        <div v-else>
            <p>No questions yet. Be the first to ask!</p>
        </div>
    </div> -->
  </template>
  
  <script>
    export default {
        name: 'Questions',
        props:{
            question_text: String,
            question_user: String,
            question_date: String
        },
    data(){
        return {
            questions: []  //Array to hold fetched questions
        }
    }
}
    // Uncomment and implement API call to fetch questions
    // mounted(){
    //     //Fetch questions from backend API when component is mounted
    //     fetch('http://localhost:3000/api/questions')
    //         .then(response => response.json())
    //         .then(data => {
    //             this.questions = data.questions; //Assuming API returns { questions: [...] }
    //         })
    //         .catch(error => {
    //             console.error('Error fetching questions:', error);
    //         });
    // }
  </script>
  
  <style scoped>
  .questions-page {
    padding: 2rem;
}

.question-container {
    border: 1px solid #ddd;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
    background-color: #f9f9f9;
}

.question-text {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.user-date {
    font-size: 0.9rem;
    color: #666;
}
</style>