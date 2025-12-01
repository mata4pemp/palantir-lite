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
export const downloadNotionPage = async (pageUrl: string): Promise<string> => {
  try {
    //fetch the HTML from notion page
    const response = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });

    //parse HTML with cheerio
    const $ = cheerio.load(response.data);

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

    return cleanedContent;
  } catch (error: any) {
    console.error('Error downloading Notion page:', error);
    throw new Error(
      'Failed to download Notion page. Make sure it\'s shared publicly.'
    );
  }
};