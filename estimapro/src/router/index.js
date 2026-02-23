import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import { auth } from "../firebase/firebase";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard: protege rutas con requiresAuth
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const user = auth.currentUser;

  // Nota: auth.currentUser a veces viene null al recargar; para Sprint 1 basta esto.
  if (requiresAuth && !user) return next("/login");

  next();
});

export default router;