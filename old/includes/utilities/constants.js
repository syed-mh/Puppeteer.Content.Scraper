const CONSTANTS = {
  ENTER_URL: "Enter a URL to start scraping from:",
  ENTER_KEYWORD:
    "Enter another keyword or a comma seperated string of keywords to use:",
  ENTER_ANOTHER_KEYWORD:
    "Enter another keyword or a comma seperated string of keywords to use, or press enter to finish adding domains:",
  /**
   * @param { Number } NOT_ADDED
   * @returns { string }
   */
  KEYWORDS_VOIDED: (NOT_ADDED) => `${NOT_ADDED} duplicates not added`,
  /**
   * @param { Number } ADDED
   * @returns { string }
   */
  KEYWORDS_ADDED: (ADDED) => `${ADDED} keywords added`,
  /**
   * @param { Number } TOTAL
   * @returns { string }
   */
  KEYWORDS_TOTAL: (TOTAL) => `${TOTAL} total keywords`,
  /**
   * @param { string[] } URLS
   * @returns { string }
   */
  LIST_KEYWORDS: (URLS) =>
    `The following keywords will now be processed:\n- ${URLS.join("\n- ")}`,
  COLORS: {
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    BLUE: "\x1b[36m",
    YELLOW: "\x1b[33m",
    RESET: "\x1b[0m",
  },
}

export default CONSTANTS
