import { createRouter, createWebHistory } from 'vue-router';

import Home from "../views/Home.vue";
//import Login from "../views/Login.vue";
import Login from "../Login2.vue";
import Questions from "../Questions.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/questions', component: Questions },
    
    // { path: '/questions', component: Questions, beforeEnter: ifAuthenticated },

    //NEED TO VALIDATE WHICH I USE, MAKE SURE USED CORRECTLY AND REMOVE THE OTHER
    //{ path: "/:pathMatch(.*)*", component: NotFound },
    // 404 - catches all unmatched routes and redirects to home
    { path: "/:pathMatch(.*)*", redirect: '/' }
];

/**
 * Route guard to check if user is authenticated.
 * Redirects to login if no session token exists in localStorage.
 */
const ifAuthenticated = (to, from, next) => {
    const loggedIn = localStorage.getItem('session_token');
    if (loggedIn) {
        next()          // Allow navigation
        return
    } else {
        next('/login'); // Redirect to login
    }
};

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;