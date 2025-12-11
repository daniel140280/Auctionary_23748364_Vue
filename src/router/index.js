import { createRouter, createWebHistory } from 'vue-router';

import Home from "../views/pages/Home.vue";
import Login from "../views/pages/Login.vue";
import Questions from "../views/pages/Questions.vue";
import SingleItem from '../views/pages/SingleItem.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/questions', component: Questions },
    { path: '/item/:item_id', component: SingleItem },
    
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