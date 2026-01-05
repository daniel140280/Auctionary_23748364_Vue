<template>
    <div class="question-container">
      <div class="question-text">
        <strong>Q:</strong> {{ question_text }}
      </div>
      <div class="user-date">
        Asked by: {{ question_user || 'Anonymous' }} on {{ formatDate(question_date) }}
      </div>
      <div v-if="answer_text" class="answer-text">
        <strong>A:</strong> {{ answer_text }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuestionItem',
    props: {
      question_text: String,
      question_user: String,
      question_date: [String, Number],
      answer_text: String
    },
    methods: {
      formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
      }
    }
  }
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