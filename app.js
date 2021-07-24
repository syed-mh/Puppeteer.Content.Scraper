/**
 * @author Syed Mohammed Hassan <mohammad.hassan@va8ivedigital.com>
 * This is the entry-point for this scraper. It should not contain any critical
 * logic for the app. Instead, it should call functions sequentially from the
 * other files in the app to simply execute them and pass data between them
 */

/**
 * Import core utilities
 */
import Browser from "./includes/Browser.js"
import Page from "./includes/Page.js"
import Prompt from "./includes/Prompt.js"
;(async () => {
  /**
   * @const { String[] } PROMPT
   */
  const PROMPT = new Prompt().keywords()

  /**
   * @const { Promise } BROWSER
   */
  const BROWSER = await new Browser(false).init()

  /**
   * @const { Promise } PAGE
   */
  const PAGE = await new Page(BROWSER).init()

  /**
   * Close the page instance
   */
  await PAGE.close(PAGE)

  /**
   * Close the browser instance
   */
  await BROWSER.close(BROWSER)
})()
