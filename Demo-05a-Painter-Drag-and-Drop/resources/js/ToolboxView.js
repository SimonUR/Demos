/* eslint-env browser */
/* global EventPublisher */

var Painter = Painter || {};
Painter.ToolboxView = function() {
  "use strict";

  var that = new EventPublisher(),
    toolbox,
    resizer;

  function setDefault() {
    var defaultElement = toolbox.querySelector(".selected");
    selectElement(defaultElement);
    changeToolSize(5);
  }

  function onResizerChanged(event) {
    var size = event.target.value;
    changeToolSize(size);
  }

  function onItemClicked(event) {
    var target = event.target;
    if (target.classList.contains("fa")) {
      target = target.parentNode;
    }
    selectElement(target);
  }

  function changeToolSize(size) {
    resizer.value = size;
    that.notifyAll("toolSizeChanged", size);
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

  function init(toolboxNode, resizerNode) {
    var index, toolboxItems = toolboxNode.querySelectorAll(".item");
    toolbox = toolboxNode;
    resizer = resizerNode;
    for (index = 0; index < toolboxItems.length; index++) {
      toolboxItems[index].addEventListener("click", onItemClicked);
    }
    resizer.addEventListener("change", onResizerChanged);
  }

  that.init = init;
  that.setDefault = setDefault;
  return that;
};
