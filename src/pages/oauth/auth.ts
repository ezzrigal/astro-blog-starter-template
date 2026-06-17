import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  // @ts-ignore
  const clientId = locals.runtime?.env?.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID || (typeof process !== 'undefined' ? process.env.GITHUB_CLIENT_ID : undefined);

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
