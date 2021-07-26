/**
 * @author Syed Mohammed Hassan <mohammad.hassan@va8ivedigital.com>
 *
 * This is the entry-point for this scraper. It should not contain any critical
 * logic for the app. Instead, it should call functions sequentially from the
 * other files in the app to simply execute them and pass data between them
 */

/**
 * Import core utilities
 */
import Browser from "./includes/Browser.old.js";
import Page from "./includes/Page.old.js";
/**
 * Async IIFE that sequentially fires functions to complete the lifecycle
 * of this app
 */
(async () => {
  const PROMPT = new Prompt();

  const KEYWORDS = PROMPT.keywords();

  // const URL = PROMPT.url();

  const BROWSER = new Browser();

  const PAGE = new Page(BROWSER);

  await BROWSER.init();

  await PAGE.init(BROWSER.browser);

  // const BrowserInstance = BROWSER().init();

  // const PageInstance = PAGE().init();

  await PAGE.navigateTo("https://syed-mh.netlify.app/");

  await PAGE.runEvents();

  /**
   * Close the page instance
   */
  await PAGE.destroy();

  /**
   * Close the browser instance
   */
  await BROWSER.destroy();
})();
