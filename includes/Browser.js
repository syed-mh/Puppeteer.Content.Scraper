module.exports = {
  /**
   * Puppeteer module
   *
   * @const { module } _puppeteer
   */
  _puppeteer: require("puppeteer"),

  /**
   * All registered page events
   *
   * @const { Object } _pageEvents
   */
  _pageEvents: require("./page/PageEvents.js"),

  /**
   * Create a browser instance
   *
   * @param { boolean } HEADLESS
   * @return { Promise<Browser> } Browser Instance
   */
  _initBrowser: async function (HEADLESS) {
    return new Promise(async (resolve) => {
      const _browser = await this._puppeteer.launch({ headless: HEADLESS });
      return resolve(_browser);
    });
  },

  /**
   * Create a page instance
   *
   * @param { Promise<Browser> } BROWSER
   * @return { Promise<Page> } Page instance
   */
  _initPage: async function (BROWSER) {
    return new Promise(async (resolve) => {
      const _page = await BROWSER.newPage();
      return resolve(_page);
    });
  },

  /**
   * Init stage of the automated scraping process
   *
   * @param { Promise<Page> } PAGE
   * @return { Object } Aggregated data from the evaluated page
   */
  _initScraper: async function (PAGE) {
    const {
      CreateFAB,
      GetNode,
      GetNodeAddress,
      GetRelevantNodes,
      DeleteAllOtherNodes,
      PromptFeedback,
    } = this._pageEvents;
    const actions = [
      CreateFAB,
      GetNode,
      GetRelevantNodes,
      GetNodeAddress,
      DeleteAllOtherNodes,
    ];
    for (const action of actions) {
      await PAGE.evaluate(action);
    }
    return new Promise(async (resolve) => {
      const response = await PAGE.evaluate(PromptFeedback);
      return resolve(response);
    });
  },

  /**
   * Run the entire script
   *
   * @param { string } URL
   * @param { boolean } HEADLESS
   * @return { void }
   */
  run: async function (URL = "https://syed-mh.netlify.app/", HEADLESS = false) {
    const browser = await this._initBrowser(HEADLESS);
    const page = await this._initPage(browser);
    await page.setViewport({
      width: 0,
      height: 0,
    });
    await page.goto(URL);
  },
};
