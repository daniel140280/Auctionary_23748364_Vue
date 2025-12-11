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
    export default {
        name: 'Login',
        data(){
            return {
                email: "",
                password: "",
                submitted: false,   //starts as false, but we change when button is clicked.
                error: ""           //initialise error property
            }
        },
        methods: {
            handleSubmit() {
                this.submitted = true;
                this.error = "";    //clear previous error messages
                const {email, password} = this;
                
                //Check if both fields are filled.
                if(!(email && password)){
                    return;
                }
                //Validate email format.
                if(!(EmailValidator.validate(email))){
                    this.error = "Email address must be a valid email format" ;
                    return;
                }
                //UPDATE REGEX INLINE WITH NODE LAYER
                //Validate password format (8+ chars, at least one letter and one number).
                const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
                if(!(password_pattern.test(password))){
                    this.error = "Password must be minimum eight characters, at least one letter and one number";
                    return;
                }
                //if we reach here, all validation passed and we send to server
                // TODO: Make API call to login endpoint
                console.log("Login attempt with:", { email, password });
                alert("Button clicked - Login attempted");

                // After successful API login, you would do:
                localStorage.setItem('session_token', response.session_token);
                this.$router.push('/');
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

input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
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