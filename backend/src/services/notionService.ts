import axios from "axios";
import * as cheerio from "cheerio";

//cheerio is a an API that allow to
// extract text from HTML
//we will use it for notion pages

//extract notion page ID from url
export const extractNotionPageId = (url: string): string | null => {
  try {
    // Notion URLs can be:
    // https://www.notion.so/Page-Title-abc123def456
    // https://username.notion.site/Page-Title-abc123def456
    const match = url.match(/([a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

//download and parse notion page content
export const downloadNotionPage = async (pageUrl: string): Promise<{ content: string; title: string }> => {
  try {
    // Extract title from the URL slug first (most reliable method)
    // Notion URLs format: https://www.notion.so/Page-Title-abc123def456
    let title = "Untitled Page";

    try {
      const urlPath = new URL(pageUrl).pathname;
      // Extract the slug part before the page ID
      // Format: /Page-Title-With-Dashes-pageId or /workspace/Page-Title-pageId
      const slugMatch = urlPath.match(/\/(?:.*?\/)?(.*?)-[a-f0-9]{32}|\/(?:.*?\/)?(.*?)-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);

      if (slugMatch) {
        const slug = slugMatch[1] || slugMatch[2];
        if (slug) {
          // Convert URL slug to readable title
          // Replace hyphens with spaces and decode URL encoding
          title = decodeURIComponent(slug)
            .replace(/-/g, ' ')
            .trim();

          // Capitalize first letter of each word for better presentation
          title = title.replace(/\b\w/g, (char) => char.toUpperCase());
        }
      }
    } catch (urlError) {
      // Could not extract title from URL, will try HTML
    }

    // Convert notion.so URLs to notion.site URLs (better for scraping)
    let scrapingUrl = pageUrl;
    if (pageUrl.includes('notion.so')) {
      // Try to convert to the public share domain
      scrapingUrl = pageUrl.replace('www.notion.so', 'notion.site');
    }

    //fetch the HTML from notion page
    const response = await axios.get(scrapingUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
        'Referer': 'https://www.google.com/',
      },
      timeout: 20000, // 20 second timeout
      maxRedirects: 5,
      validateStatus: (status) => status < 500, // Accept redirects and client errors
    });

    //parse HTML with cheerio
    const $ = cheerio.load(response.data);

    // Only try HTML extraction if URL extraction failed
    if (title === "Untitled Page") {
      // Method 1: Look for og:title meta tag
      const ogTitle = $('meta[property="og:title"]').attr('content');
      if (ogTitle && ogTitle !== 'The AI workspace that works for you. | Notion' && !ogTitle.includes('Notion')) {
        title = ogTitle;
      } else {
        // Method 2: Look for the page title in the HTML title tag
        const htmlTitle = $('title').text();
        if (htmlTitle && htmlTitle !== 'Notion') {
          title = htmlTitle;
        } else {
          // Method 3: Try to get the first h1 heading
          const h1Title = $('h1').first().text().trim();
          if (h1Title) {
            title = h1Title;
          }
        }
      }
    }

    //remove script tags, style and nav elemtns
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('.notion-topbar').remove();
    $('.notion-presence').remove();

    // Extract text from the main content area
    // Notion uses specific classes for content
    const content = $('.notion-page-content').text() || $('main').text() || $('body').text();

    // Clean up whitespace
    const cleanedContent = content
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n+/g, '\n')  // Replace multiple newlines with single newline
      .trim();

    if (!cleanedContent || cleanedContent.length < 10) {
      throw new Error('Could not extract content from Notion page. Make sure the page is public.');
    }

    return { content: cleanedContent, title };
  } catch (error: any) {
    console.error('Error downloading Notion page:', error);
    throw new Error(
      'Failed to download Notion page. Make sure it\'s shared publicly.'
    );
  }
};