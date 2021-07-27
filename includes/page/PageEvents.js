const V8_EVENTS = {
  /**
   * String constants that define the role of a node selected
   * by a user. This object gets appended to the Window object
   * to be referenced by other functions
   *
   * @return { void }
   */
  NodeRoles: function () {
    const roles = {
      POST_TITLE: "Post Title",
      CONTENT_CONTAINER: "Content Container",
    };
    window.NodeRoles = { ...roles };
  },

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
  FABConfirmClick: (EVENT) => {
    if (EVENT.target.getAttribute("v8-role") === "complete") {
      window.removeEventListener("mousemove", V8_EVENTS.HighlightMouseTarget);
      window.removeEventListener("mouseout", V8_EVENTS.DeHighlightMouseTarget);
      window.removeEventListener("click", V8_EVENTS.GetNode);
      V8_EVENTS.CacheRelevantNodes();
      V8_EVENTS.DeleteAllOtherNodes();
    }
  },

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
    if (!EVENT.target.getAttribute("v8-role")) {
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
    if (!EVENT.target.getAttribute("v8-role")) {
      EVENT.target.style.backgroundColor = "";
      EVENT.target.style.transition = "";
    }
  },

  /**
   * Function to create a little dropdown that asks users what the role of a
   * selected node is
   *
   * @param { Node } NODE
   * @return { string } Role
   */
  GetNodeRole: (NODE, POSITION_X, POSITION_Y) => {
    const roles = { ...window.NodeRoles };
    const createListItem = (VALUE, LABEL, PARENT) => {
      const item = document.createElement("li");
      item.setAttribute("value", VALUE);
      item.setAttribute("v8-role", "list-item");
      item.innerText = LABEL;
      PARENT.appendChild(item);
    };
    const dropdown = document.createElement("ul");
    dropdown.setAttribute("v8-role", "floating-dropdown");
    dropdown.setAttribute(
      "style",
      `
      left: ${POSITION_X}px;
      top: ${POSITION_Y}px;
    `
    );

    Object.keys(roles).forEach((role) => {
      createListItem(role, roles[role], dropdown);
    });
    createListItem("", "Cancel", dropdown);
    document.body.appendChild(dropdown);
    dropdown.addEventListener("click", (EVENT) => {
      EVENT.target.setAttribute("v8-role", "selected");
      setTimeout(() => EVENT.target.parentElement.remove(), 250);
      window.dispatchEvent(
        new CustomEvent("V8_CAPTURE_NODE", {
          detail: {
            role: window.NodeRoles[EVENT.target.getAttribute("value")],
            address: V8_EVENTS.GetNodeAddress(NODE),
          },
        })
      );
    });
  },

  /**
   * Get a node on click and make it available as a reference.
   *
   * @param { Event } EVENT
   * @return { void }
   */
  GetNode: (EVENT) => {
    if (!EVENT.target.getAttribute("v8-role")) {
      V8_EVENTS.GetNodeRole(EVENT.target, EVENT.x, EVENT.y);
    }
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
      _address.push(node.nodeName.toLowerCase());
      node.className &&
        node.classList.length < 2 &&
        _address.push(`.${node.className.replace(/ /g, ".")}`);
      node.id && _address.push(`#${node.id}`);
      address.unshift(_address.join(""));
      node = node.parentNode;
    }
    return address.join(" ");
  },

  CaptureNode: (EVENT) => {
    if (!window.ScrapingNodes) window.ScrapingNodes = [];
    window.ScrapingNodes.push({ ...EVENT.detail });
    console.log(EVENT, EVENT.detail);
  },

  CacheRelevantNodes: function () {
    window.ScrapingNodesCache = [];
    for (const node of window.ScrapingNodes) {
      window.ScrapingNodesCache = [
        ...window.ScrapingNodesCache,
        ...document.querySelectorAll(node.address),
      ];
    }
    return window.ScrapingNodeCache;
  },

  /**
   * Empties out the document and appends the content found by the scraper
   * instead.
   *
   * @return { void }
   */
  DeleteAllOtherNodes: () => {
    document.body.innerHTML = "";
    const nodes = [...window.ScrapingNodesCache];
    if (!nodes.filter((node) => node.role === window.NodeRoles.POST_TITLE)) {
      const title = document.createElement("h1");
      title.innerText = document.title;
      nodes.unshift(title);
    }
    nodes.forEach((node) => {
      document.body.appendChild(node);
    });
    window.dispatchEvent(new Event("V8_CONFIRMATION", { bubbles: true }));
  },

  /**
   * Cleans up and retrieves innerHTML for each scrappable node
   *
   * @return { void }
   */
  ParseNodeContents: () => {
    const nodes = { ...window.ScrapingNodes };
    for (const node in nodes) {
      node.content = [...document.querySelectorAll(node.address)].map((_node) =>
        _node.innerHTML.replace(/[/\n/\t/\r]/g, "")
      );
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
    const button = document.createElement("BUTTON");
    button.setAttribute("type", "button");
    button.setAttribute("v8-role", "complete");
    button.innerText = "DONE";
    document.body.appendChild(button);
  },
};
