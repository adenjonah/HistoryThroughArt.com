import { supabase } from './supabaseClient';

/**
 * Analytics service for retrieving and processing user session data
 */
export const AnalyticsService = {
  /**
   * Get total time spent by all users
   * @returns {Promise<number>} - Total seconds
   */
  getTotalTime: async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('session_time_sec')
        .throwOnError();
      
      if (error) throw error;

      // Sum all session times
      return data.reduce((total, session) => total + session.session_time_sec, 0);
    } catch (error) {
      console.error('Error getting total time:', error);
      return 0;
    }
  },

  /**
   * Get aggregated time per user
   * @returns {Promise<Array>} - Array of user data with total time
   */
  getUserTimeAggregated: async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('user_id, session_time_sec')
        .throwOnError();

      if (error) throw error;

      // Aggregate by user
      const userMap = {};
      data.forEach(session => {
        if (!userMap[session.user_id]) {
          userMap[session.user_id] = {
            user_id: session.user_id,
            total_time_sec: 0,
            session_count: 0
          };
        }
        userMap[session.user_id].total_time_sec += session.session_time_sec;
        userMap[session.user_id].session_count += 1;
      });

      return Object.values(userMap);
    } catch (error) {
      console.error('Error getting user time aggregated:', error);
      return [];
    }
  },

  /**
   * Get all sessions with filtering options
   * @param {Object} filters - Filter options
   * @param {string} filters.startDate - Start date (ISO string)
   * @param {string} filters.endDate - End date (ISO string)
   * @param {string} filters.pagePath - Filter by page path
   * @param {number} filters.minSessionLength - Minimum session length in seconds
   * @returns {Promise<Array>} - Filtered session data
   */
  getSessions: async (filters = {}) => {
    try {
      let query = supabase
        .from('user_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      if (filters.pagePath) {
        query = query.eq('page_path', filters.pagePath);
      }

      if (filters.minSessionLength) {
        query = query.gte('session_time_sec', filters.minSessionLength);
      }

      const { data, error } = await query.throwOnError();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  /**
   * Get unique page paths from sessions
   * @returns {Promise<Array<string>>} - Array of unique page paths
   */
  getUniquePaths: async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('page_path')
        .throwOnError();
      
      if (error) throw error;

      // Extract unique page paths
      const paths = new Set(data.map(session => session.page_path));
      return Array.from(paths);
    } catch (error) {
      console.error('Error getting unique paths:', error);
      return [];
    }
  }
}; 