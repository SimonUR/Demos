/* eslint-env browser  */
/* global EventPublisher */

var Painter = Painter || {};
Painter.PaletteView = function() {
  "use strict";

  var that = new EventPublisher(),
    palette,
    currentColor;

  function setDefault() {
    var defaultElement = palette.querySelector(":first-child");
    selectColor(defaultElement.getAttribute("value"));
  }

  function onColorClicked(event) {
    var value = event.target.getAttribute("value");
    selectColor(value);
  }

  function selectColor(color) {
    currentColor.classList.remove("black", "white", "red", "green", "blue",
      "yellow");
    currentColor.classList.add(color);
    that.notifyAll("colorSelected", color);
  }

  function init(paletteNode) {
    var index, colors = paletteNode.querySelectorAll(".item");
    palette = paletteNode;
    currentColor = palette.querySelector(".preview");
    for (index = 0; index < colors.length; index++) {
      colors[index].addEventListener("click", onColorClicked);
    }
  }

  that.init = init;
  that.setDefault = setDefault;
  return that;
};
