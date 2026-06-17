// OAuth INITIATION endpoint — Decap CMS opens this in a popup
// Redirects the user to GitHub's authorization page
//
// Required env vars (set in Cloudflare Pages → Settings → Environment Variables):
//   GITHUB_CLIENT_ID     — from your GitHub OAuth App

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response(
      'Missing GITHUB_CLIENT_ID environment variable.\nSet it in Cloudflare Pages → Settings → Environment variables.',
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }

  // Build the callback URL dynamically from the current origin
  const callbackUrl = `${url.origin}/oauth/callback`;

  // Build GitHub authorization URL
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('scope', 'repo,user');
  githubAuthUrl.searchParams.set('redirect_uri', callbackUrl);

  return Response.redirect(githubAuthUrl.toString(), 302);
};
