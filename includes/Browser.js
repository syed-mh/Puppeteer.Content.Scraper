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
   * File system module
   */
  _fileSystem: require("./FileSystem.js"),

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
  _initScraper: async function () {
    return new Promise(async (resolve) => {
      V8_EVENTS.CreateFAB();
      V8_EVENTS.NodeRoles();
      window.addEventListener("click", V8_EVENTS.GlobalPreventDefault);
      window.addEventListener("mousemove", V8_EVENTS.HighlightMouseTarget);
      window.addEventListener("mouseout", V8_EVENTS.DeHighlightMouseTarget);
      window.addEventListener("click", V8_EVENTS.GetNode);
      window.addEventListener("V8_CAPTURE_NODE", V8_EVENTS.CaptureNode);
      window.addEventListener("click", V8_EVENTS.FABConfirmClick);
      window.addEventListener("V8_COMPLETE", async () => {
        resolve(window.ScrapingNodes);
      });
    });
  },

  /**
   * Run the entire script
   *
   * @param { string } URL
   * @param { boolean } HEADLESS
   * @return { void }
   */
  run: async function (
    URLS = [
      "https://www.byrdie.com/skin-tint-ranking-5193855",
      "https://www.byrdie.com/simone-biles-olympics-setting-boundaries-5194665",
      "https://www.byrdie.com/celebrity-gray-hair-5194472",
      "https://www.byrdie.com/dolly-parton-interview-5194488",
      "https://www.byrdie.com/savannah-lee-smith-gossip-girl-skincare-routine-5193167",
      "https://www.byrdie.com/comfortable-wedding-shoes-5194016",
      "https://www.byrdie.com/vitamin-a-deficiency-symptoms-5192633",
      "https://www.byrdie.com/gemma-chan-interview-5119931",
      "https://www.byrdie.com/diy-charcoal-face-mask-5080724",
    ],
    PROJECT_IDENTIFIER = "scraper-development-trials",
    HEADLESS = false
  ) {
    const browser = await this._initBrowser(HEADLESS);
    const page = await this._initPage(browser);
    await page.setViewport({
      width: 0,
      height: 0,
    });
    let initContent;
    do {
      await page.goto(URLS[0]);
      await page.addScriptTag({
        path: "includes/page/PageEvents.js",
      });
      await page.addStyleTag({
        path: "includes/page/style.css",
      });
      initContent = await page.evaluate(this._initScraper);
      await page.close();
      await browser.close(); // @todo move browser close further down
    } while (!initContent);
    console.log(initContent);
    const initContentFiles = {
      html: this._fileSystem.createFile(
        "init-content",
        "html",
        initContent.map((node) => node.content).join(""),
        PROJECT_IDENTIFIER,
        "init"
      ),
      json: this._fileSystem.createFile(
        "init-content",
        "json",
        JSON.stringify(
          initContent.map(({ role, address }) => ({ role, address })),
          null,
          2
        ),
        PROJECT_IDENTIFIER,
        "init"
      ),
    };
  },
};
