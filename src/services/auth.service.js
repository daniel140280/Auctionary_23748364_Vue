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

export default ifAuthenticated;