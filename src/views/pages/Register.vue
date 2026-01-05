<template>
  <div class="auth-page-wrapper">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join Auctionable to start bidding</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                v-model="first_name"
                placeholder="John"
                required
              />
              <div class="error-text" v-show="submitted && !first_name">
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label for="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                v-model="last_name"
                placeholder="Doe"
                required
              />
              <div class="error-text" v-show="submitted && !last_name">
                Last name is required
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="john.doe@example.com"
              autocomplete="email"
              required
            />
            <div class="error-text" v-show="submitted && !email">
              Email is required
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Create a strong password"
              autocomplete="new-password"
              required
            />
            <div class="error-text" v-show="submitted && !password">
              Password is required
            </div>
            <div class="hint-text">
              Must be 8-16 chars, include uppercase, lowercase, number & special
              char.
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            :disabled="loading"
          >
            {{ loading ? "Creating Account..." : "Create Account" }}
          </button>

          <div class="error-message" v-if="error">{{ error }}</div>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <router-link to="/login" class="link-primary"
              >Login here</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UserService } from "@/services/user.service";
import * as EmailValidator from "email-validator";

export default {
  name: "Register",
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      submitted: false,
      error: "",
      loading: false,
    };
  },
  mounted() {
    this.email = "";
    this.password = "";
    this.first_name = "";
    this.last_name = "";
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      this.error = "";
      const { first_name, last_name, email, password } = this;

      if (!(first_name && last_name && email && password)) {
        return;
      }

      if (!EmailValidator.validate(email)) {
        this.error = "Please enter a valid email address.";
        return;
      }

      const password_pattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
      if (!password_pattern.test(password)) {
        this.error = "Password does not meet complexity requirements.";
        return;
      }

      this.loading = true;

      UserService.register(first_name, last_name, email, password)
        .then((data) => {
          console.log("Registered successfully, User ID:", data.user_id);
          alert("Account created successfully! Please log in.");
          this.$router.push("/login");
        })
        .catch((err) => {
          this.error = err;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.auth-page-wrapper {
  background-color: #f7f7f7;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 550px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 35px;
}

.auth-header h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
}

.auth-header p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.auth-form {
  margin-bottom: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.form-group input::placeholder {
  color: #999;
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 6px;
}

.hint-text {
  font-size: 0.85rem;
  color: #888;
  margin-top: 6px;
  line-height: 1.4;
}

.btn {
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #359268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-full {
  width: 100%;
  padding: 16px;
  font-size: 1.1rem;
}

.error-message {
  background: #fee;
  color: #e74c3c;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #fcc;
  margin-top: 15px;
  font-size: 0.9rem;
}

.auth-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.auth-footer p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.link-primary {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
}

.link-primary:hover {
  text-decoration: underline;
}
</style>
