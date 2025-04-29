# Supabase CORS Configuration

To ensure your Vercel deployment can communicate with Supabase, you need to add your Vercel domain to the allowed origins:

1. Go to your Supabase project dashboard
2. Go to Project Settings > API
3. Scroll down to the "CORS Configuration" section
4. Under "Additional allowed origins", add your Vercel domain:
   - `https://your-app-name.vercel.app`
   - Also add any custom domains if you're using them
5. Click Save

After updating CORS settings, redeploy your Vercel application or wait a few minutes for the settings to propagate. 