/**
 * Initiates a page instance
 *
 * Any additional mutations to the page need to happen here.
 * This file should be solely responsible for instantiating a page
 * instance that is used throughout the app. Even if the app uses
 * multiple page instances, all pages must be instantiated with
 * this file and it's contents
 *
 * @class
 */
import PageEvents from "./page/PageEvents.js";

const Page = class {
  /**
   * @public
   * @param { Promise } BROWSER
   */
  constructor(BROWSER) {
    this.browser = BROWSER;
  }

  init = async () => {
    return new Promise(async (resolve) => {
      const _page = await this.browser.newPage();
      this.page = resolve(_page);
      return this.page;
    });
  };

  navigateTo = async (URL) => {
    await this.page.goto(URL);
  };

  runEvents = async () => {
    await this.page.evaluate(() => {
      PageEvents.CreateFAB();
      alert("hello world");
    });
  };

  destroy = async () => {
    this.page.close();
    return true;
  };
};
export default Page;
