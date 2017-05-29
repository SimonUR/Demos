/* eslint-env browser  */
/* global MMEventTarget */

var Painter = Painter || {};
Painter.PaletteViewController = function(paletteNode) {
  "use strict";

  var that = new MMEventTarget(),
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
    that.dispatchEvent({
      type: "colorSelected",
      data: color,
    });
  }

  function init() {
    var colors = paletteNode.querySelectorAll(".item");
    palette = paletteNode;
    currentColor = palette.querySelector(".preview");
    for (let index = 0; index < colors.length; index++) {
      colors[index].addEventListener("click", onColorClicked);
    }
    return that;
  }

  that.setDefault = setDefault;
  return init();
};
