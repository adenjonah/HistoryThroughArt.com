import { useState, useEffect } from 'react';
import { connectToDatabase } from '../../lib/mongodb';

// This is a server-side function that gets data for the dashboard
export async function getServerSideProps(context) {
  try {
    const { db } = await connectToDatabase();
    
    // Basic analytics: page views in the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get page view count
    const pageViews = await db.collection('analytics')
      .find({ 
        $or: [
          { event: 'page_view_time' },
          { event: 'page_load' }
        ],
        serverTimestamp: { $gte: yesterday } 
      })
      .count();
    
    // Get unique visitors count (by visitorId)
    const uniqueVisitors = await db.collection('analytics')
      .distinct('visitorId', { 
        serverTimestamp: { $gte: yesterday } 
      });
    
    // Get unique sessions
    const uniqueSessions = await db.collection('analytics')
      .distinct('sessionId', { 
        serverTimestamp: { $gte: yesterday } 
      });
    
    // Get average time spent (in milliseconds)
    const timeResult = await db.collection('analytics')
      .aggregate([
        { $match: { 
          event: 'page_view_time', 
          serverTimestamp: { $gte: yesterday } 
        }},
        { $group: { 
          _id: null, 
          averageTime: { $avg: '$timeSpent' } 
        }}
      ])
      .toArray();
    
    const averageTimeSpent = timeResult.length > 0 
      ? Math.round(timeResult[0].averageTime / 1000) // Convert to seconds
      : 0;
    
    // Get top 5 pages
    const topPages = await db.collection('analytics')
      .aggregate([
        { $match: { 
          $or: [
            { event: 'page_view_time' },
            { event: 'page_load' }
          ],
          serverTimestamp: { $gte: yesterday } 
        }},
        { $group: { 
          _id: '$page', 
          count: { $sum: 1 },
          totalTime: { $sum: '$timeSpent' }
        }},
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
      .toArray();
    
    // Get device breakdown
    const devices = await db.collection('analytics')
      .aggregate([
        { $match: { 
          serverTimestamp: { $gte: yesterday } 
        }},
        { $addFields: {
          // Simple device detection based on user agent
          deviceType: {
            $cond: {
              if: { $regexMatch: { input: "$userAgent", regex: /mobile|android|iphone|ipad|ipod/i } },
              then: "Mobile",
              else: {
                $cond: {
                  if: { $regexMatch: { input: "$userAgent", regex: /tablet|ipad/i } },
                  then: "Tablet",
                  else: "Desktop"
                }
              }
            }
          }
        }},
        { $group: {
          _id: "$deviceType",
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } }
      ])
      .toArray();
    
    return {
      props: {
        pageViews,
        uniqueVisitors: uniqueVisitors.length,
        uniqueSessions: uniqueSessions.length,
        averageTimeSpent,
        topPages: topPages.map(page => ({
          page: page._id,
          count: page.count,
          averageTime: page.totalTime && page.count ? Math.round((page.totalTime / page.count) / 1000) : 0 // In seconds
        })),
        devices: devices.map(device => ({
          type: device._id,
          count: device.count
        }))
      }
    };
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return {
      props: {
        error: 'Failed to load analytics data',
        pageViews: 0,
        uniqueVisitors: 0,
        uniqueSessions: 0,
        averageTimeSpent: 0,
        topPages: [],
        devices: []
      }
    };
  }
}

export default function AnalyticsDashboard({ 
  pageViews, 
  uniqueVisitors,
  uniqueSessions,
  averageTimeSpent,
  topPages,
  devices,
  error
}) {
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="analytics-dashboard">
      <h1>Analytics Dashboard</h1>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h2>Page Views (24h)</h2>
          <div className="metric-value">{pageViews}</div>
        </div>
        
        <div className="metric-card">
          <h2>Unique Visitors (24h)</h2>
          <div className="metric-value">{uniqueVisitors}</div>
        </div>
        
        <div className="metric-card">
          <h2>Unique Sessions (24h)</h2>
          <div className="metric-value">{uniqueSessions}</div>
        </div>
        
        <div className="metric-card">
          <h2>Avg. Time on Page</h2>
          <div className="metric-value">{averageTimeSpent} sec</div>
        </div>
      </div>
      
      <div className="top-pages">
        <h2>Top Pages (24h)</h2>
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Views</th>
              <th>Avg. Time</th>
            </tr>
          </thead>
          <tbody>
            {topPages.map((page, index) => (
              <tr key={index}>
                <td>{page.page}</td>
                <td>{page.count}</td>
                <td>{page.averageTime} sec</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="device-breakdown">
        <h2>Device Types (24h)</h2>
        <table>
          <thead>
            <tr>
              <th>Device Type</th>
              <th>Visits</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr key={index}>
                <td>{device.type}</td>
                <td>{device.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="privacy-note">
        <p>Note: All visitor data is anonymous and based on sessions/browser fingerprinting.</p>
      </div>
      
      <style jsx>{`
        .analytics-dashboard {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .metric-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .metric-value {
          font-size: 2.5rem;
          font-weight: bold;
          margin-top: 0.5rem;
        }
        
        .top-pages, .device-breakdown {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        th {
          font-weight: 600;
        }
        
        .error-message {
          color: red;
          padding: 2rem;
          text-align: center;
        }
        
        .privacy-note {
          font-size: 0.875rem;
          color: #666;
          text-align: center;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
} 