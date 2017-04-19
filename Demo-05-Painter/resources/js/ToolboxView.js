/* eslint-env browser  */
/* global EventPublisher */

var Painter = Painter || {};
Painter.ToolboxView = function() {
  "use strict";

  var that = new EventPublisher(),
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
      that.notifyAll("toolSelected", value);
    } else if (element.classList.contains("action")) {
      that.notifyAll("actionSelected", value);
    }
  }

  function init(toolboxNode) {
    var index, toolboxItems = toolboxNode.querySelectorAll(".item");
    toolbox = toolboxNode;
    for (index = 0; index < toolboxItems.length; index++) {
      toolboxItems[index].addEventListener("click", onItemClicked);
    }
  }

  that.init = init;
  that.setDefault = setDefault;
  return that;
};
