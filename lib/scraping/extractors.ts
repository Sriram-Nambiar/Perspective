import * as cheerio from 'cheerio';

/**
 * Section 9 Non-article reject list
 * Standard patterns that indicate a page is NOT an article detail page.
 */
const NON_ARTICLE_PATTERNS = [
  // Categories, sections, topics, tags
  /\/category\//i,
  /\/sections?\//i,
  /\/topics?\//i,
  /\/tags?\//i,
  /\/authors?\//i,
  /\/search/i,
  /\/taxonomy/i,
  // Shows, programs, podcasts, live blogs, games
  /\/shows?\//i,
  /\/programs?\//i,
  /\/podcasts?\//i,
  /\/live\//i,
  /\/liveblog/i,
  /\/games?\//i,
  /\/puzzles\//i,
  /\/crosswords\//i,
  // Shopping, reviews, products
  /\/shopping\//i,
  /\/reviews?\//i,
  /\/products?\//i,
  /\/store\//i,
  // Corporate, support, legal, newsletter
  /\/about\b/i,
  /\/contact\b/i,
  /\/privacy\b/i,
  /\/terms\b/i,
  /\/help\b/i,
  /\/support\b/i,
  /\/subscribe/i,
  /\/newsletter/i,
  /\/rss/i,
  /\/sitemap/i,
  /\/archive/i,
  /\/video-only/i,
];

/**
 * Check if a URL matches any pattern on the canonical Non-article reject list (Section 9).
 */
export function isNonArticleUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();

    // Pure root or index pages are not detail articles
    if (path === '' || path === '/' || path === '/index.html' || path === '/news') {
      return true;
    }

    return NON_ARTICLE_PATTERNS.some((pattern) => pattern.test(url));
  } catch {
    return true; // Reject invalid URLs
  }
}

/**
 * Source-specific candidate article URL validation (Section 11 & 12).
 * Verifies that a candidate URL matches real story card patterns for that source.
 */
export function isCandidateArticleUrl(urlStr: string, sourceName?: string): boolean {
  if (isNonArticleUrl(urlStr)) {
    return false;
  }

  try {
    const parsed = new URL(urlStr);
    const path = parsed.pathname;

    // Must have a multi-segment path or long slug
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return false;

    const sourceLower = (sourceName || '').toLowerCase();

    // Reuters rules
    if (sourceLower.includes('reuters') || parsed.hostname.includes('reuters.com')) {
      // Category listing pages like /world/africa, /business are short 1-2 segment generic paths without IDs
      // Articles typically have IDs or date slugs like /world/us/some-story-title-2026-07-23/
      if (segments.length === 1) return false;
      const lastSeg = segments[segments.length - 1];
      // Reuters article slugs usually contain hyphens and numbers/date/ID
      return lastSeg.includes('-') && lastSeg.length > 15;
    }

    // NPR rules
    if (sourceLower.includes('npr') || parsed.hostname.includes('npr.org')) {
      // Rejects /sections/politics
      if (path.includes('/sections/')) return false;
      // NPR articles usually have date paths like /2026/07/23/12345/slug or /nx-s1-12345/
      const hasDateOrId = /\/\d{4}\/\d{2}\/\d{2}\//.test(path) || /\/\d{5,}\//.test(path) || /nx-s1-/i.test(path);
      const lastSeg = segments[segments.length - 1] || '';
      return hasDateOrId || (lastSeg.length > 20 && lastSeg.includes('-'));
    }

    // Fox News rules
    if (sourceLower.includes('fox') || parsed.hostname.includes('foxnews.com')) {
      if (path.includes('/person/') || path.includes('/shows/')) return false;
      const lastSeg = segments[segments.length - 1] || '';
      return lastSeg.length > 15 && lastSeg.includes('-');
    }

    // BBC News rules
    if (sourceLower.includes('bbc') || parsed.hostname.includes('bbc.')) {
      if (path.includes('/sport/') || path.includes('/weather')) return false;
      // BBC articles usually use /news/articles/c... or /news/world-us-canada-12345
      const lastSeg = segments[segments.length - 1] || '';
      return /\/articles\/c/i.test(path) || (lastSeg.includes('-') && /\d{5,}/.test(lastSeg)) || lastSeg.length > 20;
    }

    // Guardian rules
    if (sourceLower.includes('guardian') || parsed.hostname.includes('theguardian.com')) {
      // Guardian article paths always contain year/month/day e.g. /us-news/2026/jul/23/slug
      const hasDate = /\/\d{4}\/[a-z]{3}\/\d{1,2}\//i.test(path);
      const lastSeg = segments[segments.length - 1] || '';
      return hasDate || (segments.length >= 3 && lastSeg.length > 15 && lastSeg.includes('-'));
    }

    // Indian Express rules
    if (sourceLower.includes('indian express') || parsed.hostname.includes('indianexpress.com')) {
      if (path.includes('/section/') || path.includes('/photos/')) return false;
      const lastSeg = segments[segments.length - 1] || '';
      return (/\/article\//i.test(path) || /\d{6,}/.test(lastSeg)) && lastSeg.includes('-');
    }

    // Times of India rules
    if (parsed.hostname.includes('indiatimes.com')) {
      if (path.includes('/topic/') || path.includes('/mostread')) return false;
      return path.includes('articleshow/') || /\.cms$/i.test(path);
    }

    // NDTV rules
    if (sourceLower.includes('ndtv') || parsed.hostname.includes('ndtv.com')) {
      if (path.includes('/category/') || path.includes('/page/')) return false;
      const lastSeg = segments[segments.length - 1] || '';
      return /\d{6,}/.test(lastSeg) || (lastSeg.includes('-') && lastSeg.length > 15);
    }

    // The Hindu rules
    if (sourceLower.includes('hindu') || parsed.hostname.includes('thehindu.com')) {
      return /\.ece$/i.test(path) || /\/article\d+/i.test(path);
    }

    // Hindustan Times rules
    if (sourceLower.includes('hindustan') || parsed.hostname.includes('hindustantimes.com')) {
      return /-\d+\.html$/i.test(path);
    }

    // Generic fallback for candidate filtering
    const lastSegment = segments[segments.length - 1] || '';
    return lastSegment.length > 15 && lastSegment.includes('-');
  } catch {
    return false;
  }
}

/**
 * Extract visible article card links from source homepage HTML (Section 11).
 */
export function extractCandidateUrlsFromHomepageHtml(
  homepageHtml: string,
  homepageUrl: string,
  sourceName?: string
): string[] {
  const $ = cheerio.load(homepageHtml);
  const candidateUrls = new Set<string>();
  const baseDomain = new URL(homepageUrl).hostname.replace(/^www\./, '');

  // Select links inside main content / story card containers
  $('main a[href], article a[href], header a[href], section a[href], div a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;

    try {
      const fullUrl = new URL(href, homepageUrl);
      // Strip hash fragments and query string tracking parameters
      fullUrl.hash = '';
      fullUrl.search = '';

      const cleanedUrl = fullUrl.toString();

      // Ensure domain matches source domain
      const linkDomain = fullUrl.hostname.replace(/^www\./, '');
      if (linkDomain !== baseDomain && !linkDomain.endsWith(`.${baseDomain}`)) {
        return;
      }

      // Candidate check
      if (isCandidateArticleUrl(cleanedUrl, sourceName)) {
        candidateUrls.add(cleanedUrl);
      }
    } catch {
      // Ignore invalid URLs
    }
  });

  return Array.from(candidateUrls);
}
