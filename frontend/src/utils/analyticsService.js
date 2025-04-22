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
      // Instead of using an aggregate function, fetch all data and sum it client-side
      // Add cache control to prevent stale data
      const { data, error } = await supabase
        .from('user_sessions')
        .select('session_time_sec')
        .throwOnError()
        .headers({ 'Cache-Control': 'no-cache' });
      
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
      // Get all sessions and aggregate them client-side instead of using DB aggregation
      // Add cache control to prevent stale data
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .throwOnError()
        .headers({ 'Cache-Control': 'no-cache' });

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
        .order('created_at', { ascending: false })
        .headers({ 'Cache-Control': 'no-cache' });

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
      // Get all page paths and do the distinct operation client-side
      // Add cache control to prevent stale data
      const { data, error } = await supabase
        .from('user_sessions')
        .select('page_path')
        .throwOnError()
        .headers({ 'Cache-Control': 'no-cache' });
      
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