import * as cheerio from 'cheerio';
import { isNonArticleUrl } from './extractors';

export interface ParsedArticle {
  title: string;
  imageUrl: string;
  publishedDate: string; // ISO string
  rawText: string;
  canonicalUrl: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  article?: ParsedArticle;
}

/**
 * Clean up and sanitize HTML content before text extraction (Section 13).
 * Removes ads, scripts, navigation, newsletter, related stories, and boilerplate.
 */
function cleanArticleDom($: cheerio.CheerioAPI): void {
  // Remove non-content elements
  $(
    'script, style, svg, iframe, noscript, nav, footer, header, form, button, input, ' +
      'aside, .ad, .ads, .advertisement, .social-share, .share-bar, .newsletter, ' +
      '.subscription-block, .related-articles, .most-popular, .comments, .outbrain, ' +
      '.taboola, [role="navigation"], [role="banner"], [role="contentinfo"]'
  ).remove();
}

/**
 * Extract canonical URL from HTML metadata.
 */
function extractCanonicalUrl($: cheerio.CheerioAPI, fallbackUrl: string): string {
  const canonicalHref = $('link[rel="canonical"]').attr('href');
  if (canonicalHref) {
    try {
      return new URL(canonicalHref, fallbackUrl).toString();
    } catch {
      // Fallback
    }
  }
  return fallbackUrl;
}

/**
 * Extract title from HTML metadata or DOM headings.
 */
function extractTitle($: cheerio.CheerioAPI): string {
  const metaTitle =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('h1').first().text();

  let title = (metaTitle || $('title').text() || '').trim();

  // Strip source branding suffix e.g. "Story Title - BBC News" -> "Story Title"
  title = title.replace(/\s+[|\-–—]\s+.*$/, '').trim();

  return title;
}

/**
 * Extract lead image URL from HTML metadata or DOM body (Section 13).
 */
function extractImageUrl($: cheerio.CheerioAPI, pageUrl: string): string {
  const metaImage =
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    $('meta[property="og:image:secure_url"]').attr('content');

  if (metaImage) {
    try {
      return new URL(metaImage, pageUrl).toString();
    } catch {
      // Fallback to DOM images
    }
  }

  // Fallback: search main article images
  let domImageSrc: string | undefined;
  $('article img, main img, body img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && !src.includes('avatar') && !src.includes('logo') && !src.includes('icon')) {
      domImageSrc = src;
      return false; // Break loop
    }
  });

  if (domImageSrc) {
    try {
      return new URL(domImageSrc, pageUrl).toString();
    } catch {
      // Fallback
    }
  }

  return '';
}

/**
 * Extract publication date from metadata, microdata, or text (Section 13).
 */
function extractPublishedDate($: cheerio.CheerioAPI): string {
  const dateStr =
    $('meta[property="article:published_time"]').attr('content') ||
    $('meta[name="pubdate"]').attr('content') ||
    $('meta[name="publish-date"]').attr('content') ||
    $('meta[name="sailthru.date"]').attr('content') ||
    $('time[datetime]').attr('datetime') ||
    $('time').first().text();

  if (dateStr) {
    const parsedDate = Date.parse(dateStr);
    if (!isNaN(parsedDate)) {
      return new Date(parsedDate).toISOString();
    }
  }

  return '';
}

/**
 * Clean and extract raw body text, guaranteeing paragraphs (Section 13).
 */
function extractRawText($: cheerio.CheerioAPI): { paragraphs: string[]; fullText: string } {
  const paragraphTexts: string[] = [];

  // Extract from article body or main containers
  const container = $('article, main, [role="main"]').length ? $('article, main, [role="main"]') : $('body');

  container.find('p').each((_, el) => {
    const pText = $(el).text().replace(/\s+/g, ' ').trim();
    // Exclude captions, copyright notes, or short boilerplate
    if (pText.length > 25 && !pText.toLowerCase().startsWith('photo:') && !pText.toLowerCase().startsWith('copyright')) {
      paragraphTexts.push(pText);
    }
  });

  const fullText = paragraphTexts.join('\n\n');

  // If text extraction returned one large paragraph or no <p> tags, split by sentence boundaries or DOM blocks
  if (paragraphTexts.length <= 1 && fullText.length > 300) {
    const splitSentences = fullText
      .split(/(?<=[.!?])\s+/)
      .reduce<string[]>((acc, sentence) => {
        if (acc.length === 0 || acc[acc.length - 1].length > 250) {
          acc.push(sentence);
        } else {
          acc[acc.length - 1] += ' ' + sentence;
        }
        return acc;
      }, []);

    if (splitSentences.length > 1) {
      return {
        paragraphs: splitSentences,
        fullText: splitSentences.join('\n\n'),
      };
    }
  }

  return {
    paragraphs: paragraphTexts,
    fullText,
  };
}

/**
 * Validate scraped detail page content against the Article Content Gate (Section 13).
 */
export function parseAndValidateArticle(html: string, originalUrl: string): ValidationResult {
  const $ = cheerio.load(html);

  // Clean non-content elements before extraction
  cleanArticleDom($);

  const canonicalUrl = extractCanonicalUrl($, originalUrl);
  if (isNonArticleUrl(canonicalUrl)) {
    return { valid: false, reason: 'Canonical URL points to non-article listing page' };
  }

  const title = extractTitle($);
  if (!title || title.length < 10) {
    return { valid: false, reason: 'Title missing or too generic' };
  }

  // Reject generic section titles e.g. "World News", "Politics", "Latest Stories"
  const genericTitles = ['news', 'home', 'politics', 'world', 'business', 'opinion', 'sport', 'entertainment'];
  if (genericTitles.includes(title.toLowerCase())) {
    return { valid: false, reason: 'Title matches generic section header' };
  }

  const imageUrl = extractImageUrl($, originalUrl);
  if (!imageUrl) {
    return { valid: false, reason: 'Image URL missing' };
  }

  const publishedDate = extractPublishedDate($);
  if (!publishedDate) {
    return { valid: false, reason: 'Published date missing' };
  }

  const { paragraphs, fullText } = extractRawText($);

  // Body quality gate: 3 or more paragraphs OR >= 900 characters after cleanup
  const passesParagraphCount = paragraphs.length >= 3;
  const passesCharacterLength = fullText.length >= 900;

  if (!passesParagraphCount && !passesCharacterLength) {
    return {
      valid: false,
      reason: `Insufficient body content (${paragraphs.length} paragraphs, ${fullText.length} characters)`,
    };
  }

  return {
    valid: true,
    article: {
      title,
      imageUrl,
      publishedDate,
      rawText: fullText,
      canonicalUrl,
    },
  };
}
