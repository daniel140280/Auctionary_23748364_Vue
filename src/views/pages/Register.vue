<template>
    <div class="register-container">
      <h1>Create Account</h1>
      <form @submit.prevent="handleSubmit">
        
        <div class="form-group">
            <label for="first_name">First Name:</label>
            <input type="text" id="first_name" v-model="first_name" />
            <div class="error" v-show="submitted && !first_name">First name is required</div>
        </div>

        <div class="form-group">
            <label for="last_name">Last Name:</label>
            <input type="text" id="last_name" v-model="last_name" />
            <div class="error" v-show="submitted && !last_name">Last name is required</div>
        </div>

        <div class="form-group">
            <label for="email">Email address:</label>
            <input type="email" id="email" v-model="email" />
            <div class="error" v-show="submitted && !email">Email is required</div>
        </div>
  
        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password"/>
            <div class="error" v-show="submitted && !password">Password is required</div>
            <div class="hint">Must be 8-16 chars, include uppercase, lowercase, number & special char.</div>
        </div>
        
        <button type="submit" :disabled="loading">Register</button>
        
        <div class="error" v-if="error">{{ error }}</div>
        
        <div class="login-link">
            Already have an account? <router-link to="/login">Login here</router-link>
        </div>

      </form>
    </div>
</template>
  
<script>
  import { UserService } from '@/services/user.service';
  import * as EmailValidator from 'email-validator';
  
  export default {
    name: 'Register',
    data() {
      return {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        submitted: false,
        error: "",
        loading: false
      }
    },
    mounted() {
            this.email = "";
            this.password = "";
            if(this.first_name) this.first_name = "";
        },
    methods: {
      handleSubmit() {
        this.submitted = true;
        this.error = "";
        const { first_name, last_name, email, password } = this;
        if (!(first_name && last_name && email && password)) {
          return;
        }
        if (!(EmailValidator.validate(email))) {
          this.error = "Please enter a valid email address.";
          return;
        }

        const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        if (!(password_pattern.test(password))) {
          this.error = "Password does not meet complexity requirements.";
          return;
        }
  
        this.loading = true;

        UserService.register(first_name, last_name, email, password)
          .then(data => {
            console.log("Registered successfully, User ID:", data.user_id);
            alert("Account created! Please log in.");
            this.$router.push('/login');
          })
          .catch(err => {
            this.error = err;
            this.loading = false;
          });
      }
    }
  }
</script>
  
<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
}
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
button { width: 100%; padding: 0.75rem; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
button:hover { background-color: #359268; }
button:disabled { background-color: #ccc; cursor: not-allowed; }
.error { color: red; font-size: 0.875rem; margin-top: 0.5rem; }
.hint { font-size: 0.75rem; color: #666; margin-top: 0.25rem; }
.login-link { margin-top: 1.5rem; text-align: center; }
</style>