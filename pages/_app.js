import { useEffect } from 'react';
import '../styles/globals.css';
import CookieConsent from '../components/CookieConsent';

function MyApp({ Component, pageProps }) {
  // No need to manually load analytics script here anymore
  // It will be loaded by the CookieConsent component if the user consents
  
  return (
    <>
      <Component {...pageProps} />
      <CookieConsent />
    </>
  );
}

export default MyApp; 