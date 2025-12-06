import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Import views
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Home - Auctionary" },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login - Auctionary",
      guestOnly: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Create Account - Auctionary",
      guestOnly: true,
    },
  },
  {
    path: "/browse",
    name: "Browse",
    component: () => import("../views/Browse.vue"),
    meta: { title: "Browse Auctions - Auctionary" },
  },
  {
    path: "/items/:id",
    name: "ItemDetail",
    component: () => import("../views/ItemDetail.vue"),
    meta: { title: "Item Details - Auctionary" },
  },
  {
    path: "/items/new",
    name: "NewItem",
    component: () => import("../views/ItemForm.vue"),
    meta: {
      title: "List New Item - Auctionary",
      requiresAuth: true,
    },
  },
  {
    path: "/items/:id/edit",
    name: "EditItem",
    component: () => import("../views/ItemForm.vue"),
    meta: {
      title: "Edit Item - Auctionary",
      requiresAuth: true,
    },
  },
  {
    path: "/account",
    name: "Account",
    component: () => import("../views/Account.vue"),
    meta: {
      title: "My Account - Auctionary",
      requiresAuth: true,
    },
  },
  {
    path: "/account/items",
    name: "MyItems",
    component: () => import("../views/MyItems.vue"),
    meta: {
      title: "My Items - Auctionary",
      requiresAuth: true,
    },
  },
  {
    path: "/account/bids",
    name: "MyBids",
    component: () => import("../views/MyBids.vue"),
    meta: {
      title: "My Bids - Auctionary",
      requiresAuth: true,
    },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: { title: "About Us - Auctionary" },
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../views/Contact.vue"),
    meta: { title: "Contact Us - Auctionary" },
  },
  {
    path: "/faq",
    name: "FAQ",
    component: () => import("../views/FAQ.vue"),
    meta: { title: "FAQ - Auctionary" },
  },
  {
    path: "/terms",
    name: "Terms",
    component: () => import("../views/Terms.vue"),
    meta: { title: "Terms of Service - Auctionary" },
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("../views/Privacy.vue"),
    meta: { title: "Privacy Policy - Auctionary" },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("../views/ForgotPassword.vue"),
    meta: {
      title: "Forgot Password - Auctionary",
      guestOnly: true,
    },
  },
  // 404 - catches all unmatched routes
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Set page title
  document.title = to.meta.title || "Auctionary - Premium Antique Auctions";

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
    return;
  }

  // Check if route is for guests only (login, register)
  if (to.meta.guestOnly && isAuthenticated) {
    next({ name: "Home" });
    return;
  }

  next();
});

export default router;
