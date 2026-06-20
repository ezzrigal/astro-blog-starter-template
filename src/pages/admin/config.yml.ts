import type { APIRoute } from 'astro';

// @ts-ignore
import configContentRaw from '../../admin/config.yml?raw';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    let configContent = configContentRaw;

    // Replace the base_url with the dynamic request origin
    // This allows local dev (localhost) and previews to use their own origin for OAuth
    configContent = configContent.replace(
      /base_url:\s*["']?https:\/\/nqlafshriyadh\.com["']?/g,
      `base_url: "${url.origin}"`
    );

    return new Response(configContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/yaml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(`Error loading configuration: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
};
