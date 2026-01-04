<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
            <label for="email">Email address:</label>
            <input type="text" id="email" name="email" v-model = "email" />
            <div class="error" v-show="submitted && !email">Valid email address is required!</div>
        </div>

        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" v-model = "password"/>
            <div class="error" v-show="submitted && !password">Password is required!</div>
        </div>
        
        <p>{{"This is the email and password showing for test only, email:" + email + " | password:" + password}}</p>

        <button type="submit">Login</button>
        <div class="error" v-if="error">{{error}}</div>
    </form>
    </div>
  </template>
  
  <script>
  import * as EmailValidator from 'email-validator';
  import { UserService } from '@/services/user.service';

    export default {
        name: 'Login',
        data(){
            return {
                email: "",
                password: "",
                submitted: false,   //starts as false, but we change when button is clicked.
                error: "",          //initialise error property
                loading: false      //add to avoid double clicks
            }
        },
        mounted() {
            this.email = "";
            this.password = "";
            if(this.first_name) this.first_name = "";
            this.submitted = false;
            this.error = "";
        },
        methods: {
            handleSubmit() {
                this.submitted = true;
                this.error = "";    //clear previous error messages
                const {email, password} = this;
                
                if(!(email && password)){
                    return;
                }
                if(!(EmailValidator.validate(email))){
                    this.error = "Email address must be a valid email format" ;
                    return;
                } 
                const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
                if(!(password_pattern.test(password))){
                    this.error = "Password must be 8-16 characters, include uppercase, lowercase, number, and special character.";
                    return;
                }
                this.loading = true; //set loading to true to avoid double clicks
                //Call bac-end service
                UserService.login(email, password)
                .then(response => {
                console.log("Login successful:", response);
                    // Store session token and redirect to home
                    localStorage.setItem('session_token', response.session_token);
                    localStorage.setItem('user_id', response.user_id);

                    //Redirect to home page
                    this.$router.push('/');
                })
                .catch(err => {
                    console.error("Login failed:", err);
                    this.error = err.message;
                    this.loading = false; //reset loading on error
                });
            }
        }
    }

  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

button:hover {
    background-color: #359268;
}

.error {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}
  </style>