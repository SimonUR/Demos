/* eslint-env browser  */
/* global EventPublisher */

var Painter = Painter || {};
Painter.PainterModel = function() {
  "use strict";

  var that = new EventPublisher(),
    DEFAULT_CIRCLE_RADIUS = 15,
    DEFAULT_SQUARE_WIDTH = 30,
    DEFAULT_LINE_WEIGHT = 2,
    radius = DEFAULT_CIRCLE_RADIUS,
    width = DEFAULT_SQUARE_WIDTH,
    weight = DEFAULT_LINE_WEIGHT,
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

  function setRadius(newRadius) {
    radius = newRadius;
    that.notifyAll("optionsChanged", getState());
  }

  function setWidth(newWidth) {
    width = newWidth;
    that.notifyAll("optionsChanged", getState());
  }

  function setWeight(newWeight) {
    weight = newWeight;
    that.notifyAll("optionsChanged", getState());
  }

  function getState() {
    return {
      color: color,
      tool: tool,
      radius: radius,
      width: width,
      weight: weight,
    };
  }

  that.setColor = setColor;
  that.setTool = setTool;
  that.setRadius = setRadius;
  that.setWidth = setWidth;
  that.setWeight = setWeight;
  that.getState = getState;
  return that;
};
