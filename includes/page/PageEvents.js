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
    e.preventDefault();
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
