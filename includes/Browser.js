module.exports = {
  _puppeteer: require("puppeteer"),
  _pageEvents: require("./page/PageEvents.js"),
  _initBrowser: async function () {
    return new Promise(async (resolve) => {
      const _browser = await this._puppeteer.launch({ headless: false });
      return resolve(_browser);
    });
  },
  _initPage: async function (BROWSER) {
    return new Promise(async (resolve) => {
      const _page = await BROWSER.newPage();
      return resolve(_page);
    });
  },

  run: async function () {
    const browser = await this._initBrowser();
    const page = await this._initPage(browser);
    await page.setViewport({
      width: 0,
      height: 0,
    });
    await page.goto("https://syed-mh.netlify.app/");
    const data = await page.evaluate(this._pageEvents.CreateFAB);
  },
};
