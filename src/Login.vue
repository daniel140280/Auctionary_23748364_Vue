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
        <br></br>
        <br></br>
        <button type="button" @click="toggleCreateForm">Create User Account</button>
        <div class="error" v-if="error">{{error}}</div>
    </form>

    <!-- Placeholder for CreateUser component -->
     <div v-if="showCreateForm" class="create-user-form">
        <h2>Create Account</h2>
        <form @submit.prevent="createUser">
            <div class="form-group">
                <label for="first_name">First Name:</label>
                <input type="text" id="first_name" v-model="first_name"/>
            </div>
            <div class="form-group">
                <label for="last_name">Last Name:</label>
                <input type="text" id="last_name" v-model="last_name"/>
            </div>
            <div class="form-group">
                <label for="new_email">Email:</label>
                <input type="text" id="new_email" v-model="new_email"/>
            </div>
            <div class="form-group">
                <label for="new_password">Password:</label>
                <input type="text" id="new_password" v-model="new_password"/>
            </div>
            <button type="submit">Register</button>
        </form>
     </div>
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
                submitted: false,           //starts as false, but we change when button is clicked.
                error: "",                  //initialise error property
                showCreateForm: false,      //controls visibility of registration form
                first_name: "",             //registration fields
                last_name: "",
                new_email: "",
                new_password: ""
            }
        },
        methods: {
            async handleSubmit() {
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
                //API call to login endpoint
                const url = "http://localhost:3333/login";
                const data = {
                    "email" : email,
                    "password" : password
                    };

                fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
                })
                .then((response) => {
                if(response.status === 200){
                    return response.json();;
                } else if(response.status === 401){
                     // Invalid credentials → open create form
                    this.showCreateForm = true;
                    throw new Error("Login failed - invalid email or password");
                } else {
                    alert(response.status);
                    throw new Error("Login failed - server error");
                }
                })
                .then((resJson) => {
                    alert(JSON.stringify(resJson));
                    //Store session token locally
                    localStorage.setItem("session_token", resJson.session_token);
                    localStorage.setItem("user_id", resJson.user_id);
                    //Redirect to home page
                    this.$router.push("/");
                })
                .catch((err) => {
                    this.error = err.message;
                    alert("Error: " + err.message);
                });
            },
    // NEW: create user method
    async createUser() {
        const url = "http://localhost:3333/users";
        const newUser = {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.new_email,
            password: this.new_password
        };

        try {
            const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
            });

            if(response.status === 201){
            const resJson = await response.json();
            alert("User created successfully with ID: " + resJson.user_id);
            this.showCreateForm = false;
            } else {
            const err = await response.json();
            this.error = err.error_message || "User creation failed";
            }
        } catch (err) {
            this.error = "Network error: " + err.message;
        }
    },
}
};

                    // if(!response.ok){
                    //     const errorData = await response.json();
                    //     this.error = errorData.message || "Login failed";
                    //     return;
                    // } 
                    // const data = await response.json();
                    // //Store session token locally
                    // localStorage.setItem("session_token", data.session_token);
                    // localStorage.setItem("user_id", data.user_id);
                    // //Redirect to home page
                    // this.$router.push("/");
                // } catch (err){
                //     this.error = "An error occurred during login. Please try again later.";
                //     console.error("Login error:", err);
                // }
                // console.log("Login attempt with:", { email, password });
                // alert("Button clicked - Login attempted");
    
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