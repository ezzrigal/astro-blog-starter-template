import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code query parameter', { status: 400 });
  }

  // @ts-ignore
  const clientId = locals.runtime?.env?.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID || (typeof process !== 'undefined' ? process.env.GITHUB_CLIENT_ID : undefined);
  // @ts-ignore
  const clientSecret = locals.runtime?.env?.GITHUB_CLIENT_SECRET || import.meta.env.GITHUB_CLIENT_SECRET || (typeof process !== 'undefined' ? process.env.GITHUB_CLIENT_SECRET : undefined);

  if (!clientId || !clientSecret) {
    return new Response(
      `Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variables.\nSet them in Cloudflare Pages → Settings → Environment variables.`,
      { status: 500 }
    );
  }

  try {
    // Exchange the authorization code for an access token
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

    const data = await tokenResponse.json() as { access_token?: string; error?: string; error_description?: string };

    if (data.error || !data.access_token) {
      return new Response(
        `OAuth Token Exchange Error: ${data.error_description || data.error || 'No token received'}`,
        { status: 400 }
      );
    }

    const token = data.access_token;

    // Send token back to Decap CMS via postMessage in HTML response
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Authorizing...</title>
      </head>
      <body>
        <p>Authorizing, please wait...</p>
        <script>
          const token = ${JSON.stringify(token)};
          const receiveMessage = (event) => {
            // Post authorization message back to CMS window
            window.opener.postMessage(
              "authorization:github:success:" + JSON.stringify({ token: token, provider: "github" }),
              event.origin
            );
            window.removeEventListener("message", receiveMessage, false);
            window.close();
          };

          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        </script>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    return new Response(`Error exchanging code for token: ${err.message}`, { status: 500 });
  }
};
