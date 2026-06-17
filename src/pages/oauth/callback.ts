// OAuth callback handler for Decap CMS GitHub backend
// Cloudflare Pages compatible — runs as an edge function
//
// Required environment variables (set in Cloudflare Pages dashboard):
//   GITHUB_CLIENT_ID     — from your GitHub OAuth App
//   GITHUB_CLIENT_SECRET — from your GitHub OAuth App
//
// GitHub OAuth App settings:
//   Authorization callback URL: https://YOUR_SITE.pages.dev/oauth/callback

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      'GitHub OAuth credentials not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Cloudflare Pages environment variables.',
      { status: 500 }
    );
  }

  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (tokenData.error || !tokenData.access_token) {
    return new Response(
      `OAuth error: ${tokenData.error_description || tokenData.error || 'Unknown error'}`,
      { status: 400 }
    );
  }

  // Send the token back to Decap CMS via postMessage
  const html = `<!doctype html>
<html>
<head><title>Authorizing...</title></head>
<body>
<script>
  (function() {
    const token = "${tokenData.access_token}";
    const message = "authorization:github:success:" + JSON.stringify({
      token: token,
      provider: "github"
    });
    window.opener.postMessage(message, "*");
    window.close();
  })();
<\/script>
<p>Authorization successful. You can close this window.</p>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
};
