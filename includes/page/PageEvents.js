module.exports = {
  /**
   * Function to prevent click actions anywhere on the page. This
   * is done in an effort to allow users to click to select DOM
   * Nodes without triggering popups, page-loads or other side
   * effects. This event needs to be attached to the mousedown,
   * keydown and click events to really deactivate all
   * side effects.
   *
   * @param { Event } EVENT
   * @return { void }
   */
  GlobalPreventDefault: (EVENT) => {
    EVENT.preventDefault();
  },

  /**
   * Function to confirm that all selections have been made. This
   * method essentially triggers the scraper to start working.
   *
   * @param { Event } EVENT
   * @return { void }
   */
  FABConfirmClick: (EVENT) => {},

  /**
   * Function to highlight DOM Nodes when hovered on. This allows
   * users to visualize the container they're targeting. The purpose
   * of this functionality is to allow users to select a primary
   * content container, as well as other DOM Nodes that are required
   * by other scripts in this app. This function needs to be attached
   * to mousemove events.
   *
   * @param { Event } EVENT
   * @return { void }
   */
  HighlightMouseTarget: (EVENT) => {
    if (EVENT.target.id !== "v8-start") {
      EVENT.target.style.backgroundColor = "lightpink";
      EVENT.target.style.transition = "background-color 100ms linear";
    }
  },

  /**
   * Function to remove side effects from the HighlightMouseTarget
   * function. This function needs to be attached on mouseout events.
   *
   * @param { Event } EVENT
   * @return { void }
   */
  DeHighlightMouseTarget: (EVENT) => {
    if (EVENT.target.id !== "v8-start") {
      EVENT.target.style.backgroundColor = "";
      EVENT.target.style.transition = "";
    }
  },

  /**
   * Get a node on click and make it available as a reference.
   * @param { Event } EVENT
   * @return { Node }
   */
  GetNode: (EVENT) => {
    window.ScrapingNode = EVENT.target;
    return window.ScrapingNode;
  },

  /**
   * Gets a node's relative address from the document's body element. Used to identify
   * other relevant nodes in the document.
   *
   * @param { Node } NODE
   * @return { string }
   */
  GetNodeAddress: (NODE) => {
    let node = NODE;
    const address = [];
    while (node.nodeName.toLowerCase() !== "body") {
      const _address = [];
      _address.push(node.nodeName);
      node.className &&
        node.classList.length < 2 &&
        _address.push(`.${node.className.replace(/ /g, ".")}`);
      node.id && _address.push(`#${node.id}`);
      address.unshift(_address.join(""));
      node = node.parentNode;
    }
    window.ScrapingNodeAddress = address.join(" ");
    return window.ScrapingNodeAddress;
  },

  /**
   * Fetches all relevant scraping nodes from the document
   *
   * @param { String } ADDRESS
   * @return { Node[] }
   */
  GetRelevantNodes: (ADDRESS = window.ScrapingNodeAddress) => {
    window.ScrapingNodes = document.querySelectorAll(ADDRESS);
  },

  /**
   * Empties out the document and appends the content found by the scraper
   * instead.
   *
   * @param { Node[] } NODES
   * @return { void }
   */
  DeleteAllOtherNodes: (NODES = window.ScrapingNodes) => {
    document.body.innerHTML = "";
    [...NODES].forEach((node) => {
      document.body.appendChild(node);
    });
  },

  /**
   * Parses the innertext of each scrapable node from the document to
   * a JSON object
   *
   * @param { Node[] } NODES
   */
  ParseNodeContents: (NODES) => {
    const content = {
      title: document.title,
      content: {},
    };
    [...NODES].forEach((node, index) => {
      const nodeContent = [];
    });
  },

  /**
   * Function to inject a Floating Action Button (FAB) into the DOM
   * that serves as an interface between this CLI application and
   * the user on a scrape target website.
   *
   * @return { void }
   */
  CreateFAB: () => {
    const _button = document.createElement("BUTTON");
    _button.setAttribute("type", "button");
    _button.setAttribute("id", "v8-start");
    _button.setAttribute(
      "style",
      `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      font-size: 16px;
      line-height: 1em;
      padding: 0.5em 2em;
      cursor: pointer;
      border: 0;
      outline: 0;
      box-sizing: border-box;
      background: #C42026;
      color: #fff;
      font-weight: bold;
      font-family: sans-serif;
      z-index: 99999999999999;
    `
    );
    _button.innerText = "DONE";
    document.body.appendChild(_button);
  },
};
