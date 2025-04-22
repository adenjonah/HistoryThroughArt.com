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
  },

  /**
   * Import session data from a JSON file export
   * @param {Array} sessions - Array of session data objects
   * @returns {Promise<{success: boolean, imported: number, errors: number}>} - Import result
   */
  importSessionData: async (sessions) => {
    if (!Array.isArray(sessions) || sessions.length === 0) {
      return { success: false, imported: 0, errors: 0, message: 'No valid data to import' };
    }

    let importedCount = 0;
    let errorCount = 0;

    try {
      // Process in batches of 50 to avoid overwhelming the API
      const batchSize = 50;
      for (let i = 0; i < sessions.length; i += batchSize) {
        const batch = sessions.slice(i, i + batchSize);
        
        // Clean the data to ensure it matches the expected format
        const cleanedBatch = batch.map(session => ({
          user_id: session.user_id,
          session_time_sec: session.session_time_sec,
          page_path: session.page_path,
          created_at: session.created_at
        }));

        // Insert batch
        const { data, error } = await supabase
          .from('user_sessions')
          .insert(cleanedBatch)
          .select();

        if (error) {
          console.error('Error importing batch:', error);
          errorCount += batch.length;
        } else {
          importedCount += data.length;
        }
      }

      return { 
        success: importedCount > 0, 
        imported: importedCount, 
        errors: errorCount,
        message: `Imported ${importedCount} sessions (${errorCount} errors)`
      };
    } catch (error) {
      console.error('Error importing session data:', error);
      return { 
        success: false, 
        imported: importedCount, 
        errors: sessions.length - importedCount,
        message: `Error: ${error.message}`
      };
    }
  }
}; 