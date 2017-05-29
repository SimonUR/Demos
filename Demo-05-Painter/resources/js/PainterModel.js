/* eslint-env browser  */
/* global MMEventTarget */

var Painter = Painter || {};
Painter.PainterModel = function() {
  "use strict";

  const CIRCLE_RADIUS = 15,
    SQUARE_WIDTH = 30,
    LINE_WEIGHT = 2;

  var that = new MMEventTarget(),
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

  function getState() {
    return {
      color: color,
      tool: tool,
      radius: CIRCLE_RADIUS,
      width: SQUARE_WIDTH,
      weight: LINE_WEIGHT,
    };
  }

  that.setColor = setColor;
  that.setTool = setTool;
  that.getState = getState;
  return that;
};
