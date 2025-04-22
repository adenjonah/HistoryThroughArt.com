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
      console.log("Getting total time...");
      
      // Try to get count first to verify we can access the table
      const { count, error: countError } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error counting records:", countError);
      } else {
        console.log(`Found ${count} total records in user_sessions table`);
      }
      
      const { data, error } = await supabase
        .from('user_sessions')
        .select('session_time_sec');
      
      if (error) {
        console.error("Error fetching total time:", error);
        throw error;
      }

      console.log("Total time data:", data);
      
      // Sum all session times, handle NaN values
      if (!data || data.length === 0) {
        console.log("No session data found for calculating total time");
        return 0;
      }
      
      return data.reduce((total, session) => {
        const time = parseInt(session.session_time_sec) || 0;
        return total + time;
      }, 0);
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
      console.log("Getting user time aggregated...");
      
      // First do a direct query to check if data exists
      const { count, error: countError } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error counting records:", countError);
      } else {
        console.log(`Found ${count} total records in user_sessions table`);
        
        // If no records, do a direct debug query to check data
        if (count === 0) {
          console.log("No records found, trying debug query...");
          const { data: debugData } = await supabase
            .from('user_sessions')
            .select('*')
            .limit(5);
          
          console.log("Debug data result:", debugData);
        }
      }
      
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*');

      if (error) {
        console.error("Error fetching user time:", error);
        throw error;
      }

      console.log("User time data:", data);
      
      // If no data, try a manual query to double-check
      if (!data || data.length === 0) {
        console.log("No user data found, checking directly...");
        
        // Make a simple debug check
        const { data: debugData } = await supabase
          .from('user_sessions')
          .select('*')
          .limit(5);
        
        console.log("Second debug check:", debugData || "No data found");
        return [];
      }
      
      // Aggregate by user
      const userMap = {};
      data.forEach(session => {
        // Skip invalid data
        if (!session.user_id) return;
        
        if (!userMap[session.user_id]) {
          userMap[session.user_id] = {
            user_id: session.user_id,
            total_time_sec: 0,
            session_count: 0
          };
        }
        
        // Handle NaN values
        const time = parseInt(session.session_time_sec) || 0;
        userMap[session.user_id].total_time_sec += time;
        userMap[session.user_id].session_count += 1;
      });

      const result = Object.values(userMap);
      console.log("Aggregated user stats:", result);
      return result;
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
      console.log("Getting sessions with filters:", filters);
      
      // First do a direct query to check if data exists
      const { count, error: countError } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error counting session records:", countError);
      } else {
        console.log(`Found ${count} total records in user_sessions table before filtering`);
      }
      
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

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("No session data found after applying filters");
        
        // Make a simple debug check if we filtered out everything
        if (count > 0) {
          console.log("Data exists but was filtered out - sample of unfiltered data:");
          const { data: sampleData } = await supabase
            .from('user_sessions')
            .select('*')
            .limit(3);
          
          console.log("Sample data:", sampleData);
        }
      } else {
        console.log(`Found ${data.length} sessions after filtering`);
      }
      
      return data || [];
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
      console.log("Getting unique paths...");
      
      // First check if we can access data
      const { count, error: countError } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error counting records for paths:", countError);
      } else {
        console.log(`Found ${count} total records in user_sessions table for paths`);
      }
      
      const { data, error } = await supabase
        .from('user_sessions')
        .select('page_path');
      
      if (error) {
        console.error("Error fetching paths:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No path data found");
        return [];
      }
      
      // Extract unique page paths
      const paths = new Set(data.map(session => session.page_path).filter(Boolean));
      const result = Array.from(paths);
      console.log(`Found ${result.length} unique paths:`, result);
      return result;
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

    console.log("Importing session data:", sessions.length, "sessions");
    let importedCount = 0;
    let errorCount = 0;

    try {
      // Process in batches of 50 to avoid overwhelming the API
      const batchSize = 50;
      for (let i = 0; i < sessions.length; i += batchSize) {
        const batch = sessions.slice(i, i + batchSize);
        console.log(`Processing import batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(sessions.length/batchSize)}`);
        
        // Clean the data to ensure it matches the expected format
        const cleanedBatch = batch.map(session => ({
          user_id: session.user_id || 'anonymous',
          session_time_sec: parseInt(session.session_time_sec) || 0,
          page_path: session.page_path || '/',
          created_at: session.created_at || new Date().toISOString()
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
          console.log(`Successfully imported ${data.length} sessions in this batch`);
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
  },
  
  /**
   * Retry failed sessions stored in localStorage
   * @returns {Promise<{success: boolean, retried: number, errors: number}>}
   */
  retryFailedSessions: async () => {
    try {
      // Get failed sessions from localStorage
      const storedSessions = localStorage.getItem('failed_sessions');
      if (!storedSessions) {
        console.log("No failed sessions found in localStorage");
        return { 
          success: true, 
          retried: 0, 
          errors: 0,
          message: 'No failed sessions to retry'
        };
      }
      
      let sessions;
      try {
        sessions = JSON.parse(storedSessions);
      } catch (e) {
        console.error("Error parsing failed sessions:", e);
        return {
          success: false,
          retried: 0,
          errors: 0,
          message: `Failed to parse stored sessions: ${e.message}`
        };
      }
      
      if (!Array.isArray(sessions) || sessions.length === 0) {
        console.log("No valid failed sessions array in localStorage");
        return { 
          success: true, 
          retried: 0, 
          errors: 0,
          message: 'No valid failed sessions to retry'
        };
      }
      
      console.log('Found failed sessions to retry:', sessions.length);
      
      let retriedCount = 0;
      let errorCount = 0;
      
      // Process in batches of 10
      const batchSize = 10;
      for (let i = 0; i < sessions.length; i += batchSize) {
        const batch = sessions.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(sessions.length/batchSize)}`);
        
        // Clean the data
        const cleanedBatch = batch.map(session => ({
          user_id: session.user_id || 'anonymous',
          session_time_sec: parseInt(session.session_time_sec) || 0,
          page_path: session.page_path || '/',
          created_at: session.timestamp || session.created_at || new Date().toISOString()
        }));
        
        try {
          // Insert batch
          const { data, error } = await supabase
            .from('user_sessions')
            .insert(cleanedBatch)
            .select();
          
          if (error) {
            console.error('Error retrying batch:', error);
            errorCount += batch.length;
          } else {
            retriedCount += data.length;
            console.log(`Successfully retried ${data.length} sessions in this batch`);
          }
        } catch (batchError) {
          console.error('Batch error:', batchError);
          errorCount += batch.length;
        }
      }
      
      // Clear localStorage if any retries were successful
      if (retriedCount > 0) {
        localStorage.removeItem('failed_sessions');
        console.log("Cleared failed sessions from localStorage");
      }
      
      return {
        success: retriedCount > 0,
        retried: retriedCount,
        errors: errorCount,
        message: `Retried ${retriedCount} of ${sessions.length} failed sessions`
      };
    } catch (error) {
      console.error('Error retrying failed sessions:', error);
      return {
        success: false,
        retried: 0,
        errors: 0,
        message: `Error: ${error.message}`
      };
    }
  }
}; 