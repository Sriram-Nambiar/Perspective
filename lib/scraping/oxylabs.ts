/**
 * Oxylabs Web Scraper API Client
 *
 * Utilizes the Oxylabs Realtime API to retrieve target web pages with automated anti-bot bypass.
 * Requires OXY_WSA_USERNAME and OXY_WSA_PASSWORD set in environment variables.
 */

export interface OxylabsResponse {
  results: Array<{
    content: string;
    status_code: number;
    url: string;
  }>;
}

export interface ScrapeOptions {
  render?: 'html' | 'png';
  user_agent_type?: 'desktop' | 'desktop_chrome' | 'mobile_ios';
  parse?: boolean;
}

/**
 * Scrape a target URL using Oxylabs Realtime Universal Scraper API.
 *
 * @param targetUrl The full HTTP/HTTPS URL to scrape.
 * @param options Additional Oxylabs payload configurations.
 * @returns Object containing raw HTML content, final scraped URL, and HTTP status code.
 */
export async function scrapeUrlWithOxylabs(
  targetUrl: string,
  options: ScrapeOptions = {}
): Promise<{ content: string; url: string; statusCode: number }> {
  const username = process.env.OXY_WSA_USERNAME;
  const password = process.env.OXY_WSA_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Oxylabs API credentials missing. Please set OXY_WSA_USERNAME and OXY_WSA_PASSWORD in environment variables.'
    );
  }

  const payload: Record<string, unknown> = {
    source: 'universal',
    url: targetUrl,
    user_agent_type: options.user_agent_type || 'desktop_chrome',
  };

  if (options.render) {
    payload.render = options.render;
  }

  if (options.parse) {
    payload.parse = options.parse;
  }

  const credentials = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch('https://realtime.oxylabs.io/v1/queries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `Oxylabs API request failed with HTTP ${response.status}: ${response.statusText}. ${errorText}`
    );
  }

  const data = (await response.json()) as OxylabsResponse;

  if (!data.results || data.results.length === 0) {
    throw new Error(`Oxylabs API returned empty results for URL: ${targetUrl}`);
  }

  const result = data.results[0];

  if (result.status_code >= 400) {
    throw new Error(
      `Target site ${targetUrl} returned HTTP status ${result.status_code} via Oxylabs.`
    );
  }

  return {
    content: result.content || '',
    url: result.url || targetUrl,
    statusCode: result.status_code,
  };
}
