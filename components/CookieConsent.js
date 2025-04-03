import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('analytics_consent');
    if (!hasConsented) {
      setShowConsent(true);
    } else {
      // Initialize analytics if consent already given
      initAnalytics();
    }
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem('analytics_consent', 'true');
    setShowConsent(false);
    initAnalytics();
  };
  
  const declineCookies = () => {
    localStorage.setItem('analytics_consent', 'false');
    setShowConsent(false);
    // Don't initialize analytics
  };
  
  const initAnalytics = () => {
    // Load analytics script
    const script = document.createElement('script');
    script.src = '/js/analytics.js';
    script.async = true;
    document.head.appendChild(script);
  };
  
  if (!showConsent) return null;
  
  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <p>This website uses cookies to analyze site usage. Do you consent to these cookies?</p>
        <div className="cookie-buttons">
          <button onClick={acceptCookies} className="accept-button">Accept</button>
          <button onClick={declineCookies} className="decline-button">Decline</button>
        </div>
      </div>
      
      <style jsx>{`
        .cookie-consent {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #f8f8f8;
          padding: 1rem;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        
        .cookie-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        @media (min-width: 768px) {
          .cookie-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        
        .cookie-buttons {
          display: flex;
          gap: 1rem;
        }
        
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .accept-button {
          background: #4a90e2;
          color: white;
        }
        
        .decline-button {
          background: #f2f2f2;
          color: #333;
        }
      `}</style>
    </div>
  );
} 