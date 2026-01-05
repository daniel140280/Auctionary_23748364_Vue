<template>
  <div class="auth-page-wrapper">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to access your auction account</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              autocomplete="email"
              required
            />
            <div class="error-text" v-show="submitted && !email">
              Valid email address is required!
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              required
            />
            <div class="error-text" v-show="submitted && !password">
              Password is required!
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            :disabled="loading"
          >
            {{ loading ? "Logging in..." : "Login" }}
          </button>

          <div class="error-message" v-if="error">{{ error }}</div>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <router-link to="/register" class="link-primary"
              >Create one here</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as EmailValidator from "email-validator";
import { UserService } from "@/services/user.service";

export default {
  name: "Login",
  data() {
    return {
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
    if (this.first_name) this.first_name = "";
    this.submitted = false;
    this.error = "";
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      this.error = "";
      const { email, password } = this;

      if (!(email && password)) {
        return;
      }
      if (!EmailValidator.validate(email)) {
        this.error = "Email address must be a valid email format";
        return;
      }
      const password_pattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
      if (!password_pattern.test(password)) {
        this.error =
          "Password must be 8-16 characters, include uppercase, lowercase, number, and special character.";
        return;
      }
      this.loading = true;
      UserService.login(email, password)
        .then((response) => {
          console.log("Login successful:", response);
          localStorage.setItem("session_token", response.session_token);
          localStorage.setItem("user_id", response.user_id);
          this.$router.push("/");
        })
        .catch((err) => {
          console.error("Login failed:", err);
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
  max-width: 450px;
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
