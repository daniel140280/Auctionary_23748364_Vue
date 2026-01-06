import { createRouter, createWebHistory } from 'vue-router';

import ifAuthenticated from '../services/auth.service';
import Home from "../views/pages/Home.vue";
import Login from "../views/pages/Login.vue";
import Register from "../views/pages/Register.vue";
import Profile from "../views/pages/Profile.vue";
import Questions from "../views/pages/Questions.vue";
import SingleItem from '../views/pages/SingleItem.vue';
//import ifAuthenticated from '../views/middleware/ifAuthenticated.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    //Protected Routes
    // { path: '/questions', name: 'Questions', component: Questions},
    // { path: '/item/:item_id', name: 'SingleItem', component: SingleItem },
    // { path: '/profile', name: 'Profile', component: Profile},
    { path: '/questions', name: 'Questions', component: Questions, meta: { requiresAuth: true } },
    { path: '/item/:item_id', name: 'SingleItem', component: SingleItem, meta: { requiresAuth: false } },
    { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
    
    // { path: '/questions', component: Questions, beforeEnter: ifAuthenticated },

    { path: "/:pathMatch(.*)*", redirect: '/' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        ifAuthenticated(to, from, next);
    } else {
        next();
    }
});

export default router;