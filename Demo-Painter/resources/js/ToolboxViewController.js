/* eslint-env browser  */
/* global MMEventTarget */

var Painter = Painter || {};
Painter.ToolboxViewController = function(toolboxNode) {
  "use strict";

  var that = new MMEventTarget(),
    toolbox;

  function setDefault() {
    var defaultElement = toolbox.querySelector(".selected");
    selectElement(defaultElement);
  }

  function onItemClicked(event) {
    var target = event.target;
    if (target.classList.contains("fa")) {
      target = target.parentNode;
    }
    selectElement(target);
  }

  function selectElement(element) {
    var value, selectedItem = toolbox.querySelector(".selected");
    selectedItem.classList.remove("selected");
    element.classList.add("selected");
    value = element.getAttribute("value");
    if (element.classList.contains("tool")) {
      that.dispatchEvent({
        type: "toolSelected",
        data: value,
      });

    } else if (element.classList.contains("action")) {

      that.dispatchEvent({
        type: "actionSelected",
        data: value,
      });
    }
  }

  function init() {
    var toolboxItems = toolboxNode.querySelectorAll(".item");
    toolbox = toolboxNode;
    for (let index = 0; index < toolboxItems.length; index++) {
      toolboxItems[index].addEventListener("click", onItemClicked);
    }
    return that;
  }

  that.setDefault = setDefault;
  return init();
};
