# Supabase CORS Configuration

To ensure your Vercel deployment can communicate with Supabase, you need to add your Vercel domain to the allowed origins:

1. Go to your Supabase project dashboard
2. Navigate to Project Settings → API 
3. Scroll down to "CORS Configuration" section
4. Under "Additional allowed origins", add your domains:
   - Production: `https://historythroughart.com` (add any other production domains)
   - Development: `http://localhost:3000`
   - Add any other domains where your app is deployed

## Troubleshooting CORS Issues

If you're experiencing CORS errors when trying to connect to Supabase, follow these steps:

1. **Check Browser Console**: Look for errors like "Access-Control-Allow-Origin" which indicate CORS issues.

2. **Verify Correct Domain**: Make sure the exact domain you're accessing from is in the allowed origins list.
   - Include the protocol (`http://` or `https://`)
   - Include any subdomain (e.g., `www.yoursite.com` is different from `yoursite.com`)
   - Include the port if non-standard (e.g., `http://localhost:3000`)
   - Do not include trailing slashes or paths

3. **Test with Direct API Requests**: Use the "Test Direct Fetch" button on the Supabase Debug page to bypass the Supabase client library.

4. **Check Network Tab**: In browser developer tools, look at the Network tab to see the actual request headers and response.

5. **Try Incognito Mode**: Some browser extensions can interfere with CORS requests.

6. **Clear Browser Cache**: CORS errors can sometimes be cached by browsers.

## Example CORS Configuration

Your CORS configuration should look something like this:

```
- https://historythroughart.com
- https://www.historythroughart.com
- http://localhost:3000
```

## Testing CORS Setup

After updating your CORS settings, you can test if they're working correctly:

1. Go to the Admin section of your app (`/admin/supabase-debug`)
2. Click on "Test Connection" or "Test Direct Fetch"
3. If successful, you should see a successful connection status
4. If it fails with a CORS error, double-check your allowed origins list

Remember that CORS changes may take a few minutes to propagate through Supabase's services. 