import { supabase } from './supabaseClient';

/**
 * Authentication service for the admin dashboard
 */
export const AuthService = {
  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - Auth response with user and session data
   */
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  },

  /**
   * Get the current session
   * @returns {Promise<object|null>} - Current session or null
   */
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  isAuthenticated: async () => {
    const session = await AuthService.getSession();
    return !!session;
  }
}; 