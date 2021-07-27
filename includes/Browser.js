const { PageEmittedEvents } = require("puppeteer");

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
      resolve(true);
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
    URL = "https://www.canstarblue.com.au/home-garden/mattresses/",
    HEADLESS = false
  ) {
    const browser = await this._initBrowser(HEADLESS);
    const page = await this._initPage(browser);
    await page.setViewport({
      width: 0,
      height: 0,
    });
    // let initSuccess;
    // do {
    await page.goto(URL);
    await page.addScriptTag({
      path: "includes/page/PageEvents.js",
    });
    await page.addStyleTag({
      path: "includes/page/style.css",
    });
    await page.evaluate(this._initScraper);
    //   initSuccess = await page.evaluate(async () => {
    //     return new Promise(async (resolve) => {
    //       window.addEventListener("V8_CONFIRMATION", () => {
    //         (() => {
    //           const container = document.createElement("div");
    //           container.setAttribute("v8-role", "confirmation-container");
    //           const text = document.createElement('p');
    //           text.innerText = 'Is this content correct?'
    //           const confirm = document.createElement("button");
    //           confirm.setAttribute("v8-role", "confirm");
    //           confirm.innerText = "Yes";
    //           const deny = document.createElement("button");
    //           deny.setAttribute("v8-role", "deny");
    //           deny.innerText = "No";
    //         })();
    //       });
    //       let confirmation;
    //       const GetConfirmation = (EVENT) => {
    //         const attribute = EVENT.target.getAttribute("v8-role");
    //         if (!["confirm", "deny"].includes(attribute)) return false;
    //         confirmation = attribute === "confirm";
    //       };
    //       window.addEventListener("click", GetConfirmation);
    //       resolve(confirmation);
    //     });
    // });
    // } while (!initSuccess);
  },
};
