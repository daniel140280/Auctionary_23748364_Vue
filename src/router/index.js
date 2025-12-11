import { createRouter, createWebHistory } from 'vue-router';

import Home from "../views/pages/Home.vue";
import Login from "../views/pages/Login.vue";
import Register from "../views/pages/Register.vue";
import Questions from "../views/pages/Questions.vue";
import SingleItem from '../views/pages/SingleItem.vue';
//import ifAuthenticated from '../views/middleware/ifAuthenticated.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/questions', component: Questions },
    { path: '/item/:item_id', component: SingleItem },
    
    // { path: '/questions', component: Questions, beforeEnter: ifAuthenticated },

    //NEED TO VALIDATE WHICH I USE, MAKE SURE USED CORRECTLY AND REMOVE THE OTHER
    //{ path: "/:pathMatch(.*)*", component: NotFound },
    // 404 - catches all unmatched routes and redirects to home
    { path: "/:pathMatch(.*)*", redirect: '/' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;