import { computed } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  auth,
  authReady,
  authUser,
  waitForAuthInit,
} from "../firebase/firebase";

const isAuthenticated = computed(() => Boolean(authUser.value));

const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

const register = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

const logout = () => signOut(auth);

export function useAuth() {
  return {
    auth,
    user: authUser,
    isAuthReady: authReady,
    isAuthenticated,
    waitForAuthInit,
    login,
    register,
    logout,
  };
}
