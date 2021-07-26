import puppeteer from "puppeteer";

/**
 * Initiates a puppeteer browser instance
 *
 * Any additional mutations to the browser need to be passed in here
 * This function should be the only one responsible in the entire app
 * for initiating a browser instance, and this should be the only browser
 * intance used by the entire app.
 *
 * @class
 */
const Browser = class {
  /**
   * @public
   * @param { boolean } HEADLESS
   */
  constructor(HEADLESS = false) {
    this.headless = HEADLESS;
  }

  /**
   * Initiates a puppeteer browser
   * @public
   * @return { Promise } Browser Instance
   */
  init = async () => {
    return new Promise(async (resolve) => {
      const _browser = await puppeteer.launch({ headless: this.headless });
      this.browser = resolve(_browser);
      return this.browser;
    });
  };

  /**
   * Closes the browser instance, always returns true
   * @public
   * @param { Promise } BROWSER
   * @return { true }
   */
  destroy = async () => {
    this.browser.close();
    return true;
  };
};

export default Browser;
