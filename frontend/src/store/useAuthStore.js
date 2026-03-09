import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthChecking: true, // Used to show a loading screen while checking the cookie on refresh

  // Called when login succeeds or when we fetch the user on page load
  setAuth: (user) => set({ user, isAuthenticated: true, isAuthChecking: false }),

  // Called when logout succeeds or if the cookie is expired
  clearAuth: () => set({ user: null, isAuthenticated: false, isAuthChecking: false }),
}));

export default useAuthStore;