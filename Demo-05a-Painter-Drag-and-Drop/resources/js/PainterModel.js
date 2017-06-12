/* eslint-env browser  */
/* global MMEventTarget */

var Painter = Painter || {};
Painter.PainterModel = function() {
  "use strict";

  const DEFAULT_SIZE = 0.5,
    CIRCLE_RADIUS = 50,
    SQUARE_WIDTH = 100,
    LINE_WEIGHT = 20;

  var that = new MMEventTarget(),
    size = DEFAULT_SIZE,
    color,
    tool;

  function setColor(newColor) {
    color = newColor;
    that.dispatchEvent({
      type: "optionsChanged",
      data: getState(),
    });
  }

  function setTool(newTool) {
    tool = newTool;
    that.dispatchEvent({
      type: "optionsChanged",
      data: getState(),
    });
  }

  function setSize(newSize) {
    size = newSize;
    that.dispatchEvent({
      type: "optionsChanged",
      data: getState(),
    });
  }

  function getState() {
    return {
      color: color,
      tool: tool,
      radius: CIRCLE_RADIUS * size,
      width: SQUARE_WIDTH * size,
      weight: LINE_WEIGHT * size,
    };
  }

  that.setColor = setColor;
  that.setTool = setTool;
  that.setSize = setSize;
  that.getState = getState;
  return that;
};
