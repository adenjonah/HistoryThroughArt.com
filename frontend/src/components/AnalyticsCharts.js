import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  LineController,
  BarController
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsCharts = ({ sessions }) => {
  const [pageDistributionData, setPageDistributionData] = useState(null);
  const [weekdayUsageData, setWeekdayUsageData] = useState(null);
  const [sessionDurationData, setSessionDurationData] = useState(null);
  
  useEffect(() => {
    if (!sessions || sessions.length === 0) return;
    
    // Helper function for chart colors
    const getColorForIndex = (index) => {
      const colors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)',
        'rgba(83, 102, 255, 0.6)',
        'rgba(40, 159, 64, 0.6)',
        'rgba(210, 99, 132, 0.6)',
      ];
      return colors[index % colors.length];
    };
    
    // Process Page Distribution
    // Get sessions from the last 24 hours
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setHours(now.getHours() - 24);
    
    const recentSessions = sessions.filter(session => {
      const sessionDate = new Date(session.created_at);
      return sessionDate >= yesterday && sessionDate <= now;
    });
    
    // Calculate total time
    const totalTime = recentSessions.reduce((sum, session) => 
      sum + (session.session_time_sec || 0), 0);
    
    // Group by page path
    const pageTimeMap = {};
    recentSessions.forEach(session => {
      const pagePath = session.page_path || 'unknown';
      if (!pageTimeMap[pagePath]) {
        pageTimeMap[pagePath] = 0;
      }
      pageTimeMap[pagePath] += session.session_time_sec || 0;
    });
    
    // Convert to percentages
    const pageLabels = [];
    const pageData = [];
    const pageColors = [];
    
    Object.entries(pageTimeMap).forEach(([path, time], index) => {
      const percentage = totalTime > 0 ? (time / totalTime) * 100 : 0;
      pageLabels.push(path);
      pageData.push(percentage.toFixed(1));
      pageColors.push(getColorForIndex(index));
    });
    
    setPageDistributionData({
      labels: pageLabels,
      datasets: [
        {
          label: 'Time Spent (%)',
          data: pageData,
          backgroundColor: pageColors,
          borderColor: pageColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    });
    
    // Process Weekday Usage
    // Group sessions by day of week
    const weekdaySessions = {
      0: [], // Sunday
      1: [], // Monday
      2: [], // Tuesday
      3: [], // Wednesday
      4: [], // Thursday
      5: [], // Friday
      6: [], // Saturday
    };
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at);
      const dayOfWeek = sessionDate.getDay();
      weekdaySessions[dayOfWeek].push(session);
    });
    
    // Calculate average time per day
    const weekdayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const averageTimes = [];
    const sessionCounts = [];
    
    weekdayLabels.forEach((day, index) => {
      const daySessions = weekdaySessions[index];
      const totalTime = daySessions.reduce((sum, session) => 
        sum + (session.session_time_sec || 0), 0);
      
      // To get an average, count the number of unique days for this weekday
      const uniqueDates = new Set();
      daySessions.forEach(session => {
        const date = new Date(session.created_at);
        uniqueDates.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
      });
      
      const daysCount = uniqueDates.size || 1; // Avoid division by zero
      const averageTime = totalTime / daysCount;
      averageTimes.push(averageTime.toFixed(1));
      sessionCounts.push(daySessions.length);
    });
    
    setWeekdayUsageData({
      labels: weekdayLabels,
      datasets: [
        {
          type: 'bar',
          label: 'Avg. Time per Day (seconds)',
          data: averageTimes,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Session Count',
          data: sessionCounts,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y1',
        },
      ],
    });
    
    // Process Session Duration
    // Define duration buckets (in seconds)
    const buckets = [
      { min: 0, max: 10, label: '0-10s' },
      { min: 10, max: 30, label: '10-30s' },
      { min: 30, max: 60, label: '30-60s' },
      { min: 60, max: 120, label: '1-2m' },
      { min: 120, max: 300, label: '2-5m' },
      { min: 300, max: 600, label: '5-10m' },
      { min: 600, max: 1800, label: '10-30m' },
      { min: 1800, max: 3600, label: '30-60m' },
      { min: 3600, max: Number.MAX_SAFE_INTEGER, label: '60m+' },
    ];
    
    // Get sessions from the last week
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    
    const weekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.created_at);
      return sessionDate >= lastWeek && sessionDate <= now;
    });
    
    // Count sessions in each bucket
    const bucketCounts = buckets.map(bucket => ({
      ...bucket,
      count: 0,
    }));
    
    weekSessions.forEach(session => {
      const duration = session.session_time_sec || 0;
      for (const bucket of bucketCounts) {
        if (duration >= bucket.min && duration < bucket.max) {
          bucket.count++;
          break;
        }
      }
    });
    
    setSessionDurationData({
      labels: bucketCounts.map(bucket => bucket.label),
      datasets: [
        {
          label: 'Number of Sessions',
          data: bucketCounts.map(bucket => bucket.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
      ],
    });
    
  }, [sessions]);
  
  // Options for charts
  const pageDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Page Distribution (Last 24 Hours) - Public Pages Only',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };
  
  const weekdayUsageOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Usage by Day of Week - Public Pages Only',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Average Time (seconds)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Number of Sessions',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  
  const sessionDurationOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Session Duration Distribution (Last Week) - Public Pages Only',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Sessions',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Duration',
        },
      },
    },
  };
  
  // If no data, show loading or empty state
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Charts</h3>
        <div className="text-center py-8 text-gray-500">
          No session data available to generate charts.
        </div>
      </div>
    );
  }
  
  // If still processing data, show loading
  if (!pageDistributionData || !weekdayUsageData || !sessionDurationData) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Charts</h3>
        <div className="text-center py-8 text-gray-500">
          Processing chart data...
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Analytics Charts</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Page Distribution Chart */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <Pie data={pageDistributionData} options={pageDistributionOptions} />
          </div>
          
          {/* Weekday Usage Chart */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <Bar data={weekdayUsageData} options={weekdayUsageOptions} />
          </div>
        </div>
        
        {/* Session Duration Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <Bar data={sessionDurationData} options={sessionDurationOptions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts; 