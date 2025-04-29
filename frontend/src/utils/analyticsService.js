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
        return 0;
      } else {
        console.log(`Found ${count} total records in user_sessions table`);
      }
      
      if (count === 0) {
        return 0;
      }
      
      // Use pagination to get all session times
      const pageSize = 1000;
      const totalPages = Math.ceil(count / pageSize);
      let totalTime = 0;
      
      console.log(`Calculating total time using ${totalPages} pages of ${pageSize} records each`);
      
      for (let page = 0; page < totalPages; page++) {
        const from = page * pageSize;
        const to = Math.min(from + pageSize - 1, count - 1);
        
        console.log(`Fetching time data page ${page + 1}/${totalPages}, records ${from}-${to}`);
        
        const { data, error } = await supabase
          .from('user_sessions')
          .select('session_time_sec')
          .range(from, to);
        
        if (error) {
          console.error(`Error fetching time data page ${page + 1}:`, error);
          continue; // Try to get other pages even if one fails
        }
        
        if (!data || data.length === 0) {
          console.log(`No time data returned for page ${page + 1}`);
          continue;
        }
        
        // Sum times for this page
        const pageTotal = data.reduce((total, session) => {
          const time = parseInt(session.session_time_sec) || 0;
          return total + time;
        }, 0);
        
        totalTime += pageTotal;
        console.log(`Page ${page + 1} time: ${pageTotal} seconds, running total: ${totalTime} seconds`);
      }
      
      console.log(`Final total time: ${totalTime} seconds`);
      return totalTime;
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
      
      // Use the analytics_users view if it exists
      // First try to query the view
      const { data: viewData, error: viewError } = await supabase
        .from('analytics_users')
        .select('*');
      
      // If the view exists and query succeeds, use that data
      if (!viewError && viewData) {
        console.log(`Found ${viewData.length} users from analytics_users view`);
        return viewData;
      }
      
      // Fall back to manual aggregation if the view doesn't exist
      console.log("analytics_users view not available, falling back to manual aggregation");
      
      // First do a direct query to check if data exists
      const { count, error: countError } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error counting records:", countError);
        return [];
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
          return [];
        }
      }
      
      // Use pagination to get all session data
      const pageSize = 1000;
      const totalPages = Math.ceil(count / pageSize);
      const userMap = {};
      
      console.log(`Fetching user data using ${totalPages} pages of ${pageSize} records each`);
      
      for (let page = 0; page < totalPages; page++) {
        const from = page * pageSize;
        const to = Math.min(from + pageSize - 1, count - 1);
        
        console.log(`Fetching user data page ${page + 1}/${totalPages}, records ${from}-${to}`);
        
        const { data, error } = await supabase
          .from('user_sessions')
          .select('*')
          .range(from, to);
        
        if (error) {
          console.error(`Error fetching user data page ${page + 1}:`, error);
          continue; // Try to get other pages even if one fails
        }
        
        if (!data || data.length === 0) {
          console.log(`No user data returned for page ${page + 1}`);
          continue;
        }
        
        console.log(`Processing ${data.length} sessions from page ${page + 1}`);
        
        // Aggregate by user
        data.forEach(session => {
          // Skip invalid data
          if (!session.user_id) return;
          
          // Skip test and permission test entries
          const userId = session.user_id.toLowerCase();
          if (userId.includes('test-') || userId.includes('permissi')) {
            return;
          }
          
          // Skip non-public pages
          const pagePath = session.page_path || '';
          const nonPublicKeywords = ['admin', 'test', 'debug', 'develop', 'permission'];
          if (nonPublicKeywords.some(keyword => pagePath.includes(keyword))) {
            return;
          }
          
          if (!userMap[session.user_id]) {
            userMap[session.user_id] = {
              user_id: session.user_id,
              display_id: `User ${session.user_id.substring(0, 8)}...`,
              total_time_sec: 0,
              session_count: 0,
              first_seen: session.created_at,
              last_seen: session.created_at
            };
          }
          
          // Handle NaN values
          const time = parseInt(session.session_time_sec) || 0;
          userMap[session.user_id].total_time_sec += time;
          userMap[session.user_id].session_count += 1;
          
          // Update first/last seen
          if (session.created_at < userMap[session.user_id].first_seen) {
            userMap[session.user_id].first_seen = session.created_at;
          }
          if (session.created_at > userMap[session.user_id].last_seen) {
            userMap[session.user_id].last_seen = session.created_at;
          }
        });
      }
      
      // Filter out users with only one session
      const result = Object.values(userMap).filter(user => user.session_count > 1);
      
      console.log(`Aggregated ${result.length} unique users from ${count} sessions`);
      return result;
    } catch (error) {
      console.error('Error getting user time aggregated:', error);
      return [];
    }
  },

  /**
   * Get all sessions with filtering options, using pagination for efficient loading
   * @param {Object} filters - Filter options
   * @param {string} filters.startDate - Start date (ISO string)
   * @param {string} filters.endDate - End date (ISO string)
   * @param {string} filters.pagePath - Filter by page path
   * @param {number} filters.minSessionLength - Minimum session length in seconds
   * @param {number} filters.pageSize - Number of records per page (default: 1000)
   * @param {number} filters.maxRecords - Maximum total records to fetch (default: all)
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
        return [];
      } else {
        console.log(`Found ${count} total records in user_sessions table before filtering`);
      }
      
      if (count === 0) {
        return [];
      }
      
      // Set pagination parameters
      const pageSize = filters.pageSize || 1000;
      const maxRecords = filters.maxRecords || count;
      const totalPages = Math.ceil(Math.min(maxRecords, count) / pageSize);
      
      console.log(`Pagination setup: pageSize=${pageSize}, maxRecords=${maxRecords}, totalPages=${totalPages}`);
      
      // Build the base query with filters
      const buildQuery = () => {
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
        
        return query;
      };
      
      // Fetch all pages and combine results
      let allResults = [];
      let lastError = null;
      
      console.log(`Fetching data with pagination: ${totalPages} pages of ${pageSize} records each`);
      
      // For the first page, get up to pageSize records
      console.log(`Fetching page 1/${totalPages}, records 0-${pageSize-1}`);
      const firstPageQuery = buildQuery().range(0, pageSize-1);
      const { data: firstPageData, error: firstPageError } = await firstPageQuery;
      
      if (firstPageError) {
        console.error(`Error fetching first page:`, firstPageError);
        lastError = firstPageError;
      } else if (firstPageData && firstPageData.length > 0) {
        allResults = [...firstPageData];
        console.log(`Added ${firstPageData.length} records from page 1, total: ${allResults.length}`);
        
        // If we need more than one page and got a full first page, fetch additional pages
        if (totalPages > 1 && firstPageData.length === pageSize) {
          for (let page = 1; page < totalPages; page++) {
            const from = page * pageSize;
            const to = Math.min(from + pageSize - 1, maxRecords - 1);
            
            if (from >= maxRecords) break;
            
            console.log(`Fetching page ${page + 1}/${totalPages}, records ${from}-${to}`);
            
            const query = buildQuery().range(from, to);
            const { data, error } = await query;
            
            if (error) {
              console.error(`Error fetching page ${page + 1}:`, error);
              lastError = error;
              continue; // Try to get other pages even if one fails
            }
            
            if (data && data.length > 0) {
              allResults = [...allResults, ...data];
              console.log(`Added ${data.length} records from page ${page + 1}, total: ${allResults.length}`);
            } else {
              console.log(`No data returned for page ${page + 1}, stopping pagination`);
              break; // No more data, stop fetching
            }
            
            // If we've reached the maximum records, stop
            if (allResults.length >= maxRecords) {
              allResults = allResults.slice(0, maxRecords);
              break;
            }
          }
        }
      } else {
        console.log(`No data returned for first page`);
      }
      
      if (allResults.length === 0 && lastError) {
        throw lastError; // Re-throw the last error if we got no results
      }
      
      console.log(`Found ${allResults.length} total sessions after filtering and pagination`);
      
      return allResults;
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
        return [];
      } else {
        console.log(`Found ${count} total records in user_sessions table for paths`);
      }
      
      if (count === 0) {
        console.log("No path data found");
        return [];
      }
      
      // Use pagination to get all page paths
      const pageSize = 1000;
      const totalPages = Math.ceil(count / pageSize);
      const pathsSet = new Set();
      
      console.log(`Fetching paths using ${totalPages} pages of ${pageSize} records each`);
      
      for (let page = 0; page < totalPages; page++) {
        const from = page * pageSize;
        const to = Math.min(from + pageSize - 1, count - 1);
        
        console.log(`Fetching paths page ${page + 1}/${totalPages}, records ${from}-${to}`);
        
        const { data, error } = await supabase
          .from('user_sessions')
          .select('page_path')
          .range(from, to);
        
        if (error) {
          console.error(`Error fetching paths page ${page + 1}:`, error);
          continue; // Try to get other pages even if one fails
        }
        
        if (!data || data.length === 0) {
          console.log(`No path data returned for page ${page + 1}`);
          continue;
        }
        
        // Add unique paths to the set
        data.forEach(session => {
          if (session.page_path) {
            pathsSet.add(session.page_path);
          }
        });
        
        console.log(`Found ${pathsSet.size} unique paths so far after page ${page + 1}`);
      }
      
      // Convert set to array
      const result = Array.from(pathsSet);
      console.log(`Found ${result.length} total unique paths`);
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
  },

  /**
   * Diagnostic function to check database connection and configuration
   * @returns {Promise<Object>} - Diagnostic results
   */
  checkDatabaseStatus: async () => {
    const results = {
      connection: 'unknown',
      connectionError: null,
      tableAccess: 'unknown',
      tableAccessError: null,
      recordCount: 0,
      dataExample: null,
      supabaseUrl: supabase.supabaseUrl ? 'configured' : 'missing',
      supabaseKey: supabase.supabaseKey ? 'configured' : 'missing',
    };

    try {
      // Test basic connection
      console.log("Testing database connection...");
      const { data, error } = await supabase.from('user_sessions').select('*', { count: 'exact', head: true });
      
      if (error) {
        results.connection = 'failed';
        results.connectionError = error.message;
        console.error("Connection error:", error);
      } else {
        results.connection = 'success';
        results.recordCount = data?.count || 0;
        console.log(`Connection successful, found ${results.recordCount} records`);
      }
      
      // Test read access if connection is working
      if (results.connection === 'success') {
        const { data: sampleData, error: sampleError } = await supabase
          .from('user_sessions')
          .select('*')
          .limit(1);
        
        if (sampleError) {
          results.tableAccess = 'failed';
          results.tableAccessError = sampleError.message;
          console.error("Table access error:", sampleError);
        } else {
          results.tableAccess = 'success';
          results.dataExample = sampleData;
          console.log("Table access successful, sample data:", sampleData);
        }
      }
    } catch (error) {
      console.error("Diagnostic error:", error);
      results.connection = 'error';
      results.connectionError = error.message;
    }
    
    return results;
  }
}; 