import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only protect the admin/analytics route
  if (request.nextUrl.pathname.startsWith('/admin/analytics')) {
    // Check for basic auth in the headers
    const authHeader = request.headers.get('authorization');
    
    // Create a hardcoded username and password (use environment variables in production)
    const username = process.env.ANALYTICS_USERNAME || 'admin';
    const password = process.env.ANALYTICS_PASSWORD || 'your-secure-password';
    
    // The expected authorization header value
    const expectedAuthValue = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    
    // If auth header is missing or incorrect
    if (!authHeader || authHeader !== expectedAuthValue) {
      // Respond with a 401 and a WWW-Authenticate header
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Analytics Dashboard"'
        }
      });
    }
  }
  
  // If auth is successful or not needed, continue
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 