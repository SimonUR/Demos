/* eslint-env browser  */
/* global EventPublisher */

var Painter = Painter || {};
Painter.PainterModel = function() {
  "use strict";

  var that = new EventPublisher(),
    CIRCLE_RADIUS = 15,
    SQUARE_WIDTH = 30,
    LINE_WEIGHT = 2,
    color,
    tool;

  function setColor(newColor) {
    color = newColor;
    that.notifyAll("optionsChanged", getState());
  }

  function setTool(newTool) {
    tool = newTool;
    that.notifyAll("optionsChanged", getState());
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
