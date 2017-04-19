/* eslint-env browser */
/* global EventPublisher */

var EffectPlayer = EffectPlayer || {};
EffectPlayer.VideoCanvas = function(options) {
  "use strict";

  var that = new EventPublisher(),
    filter = new EffectPlayer.CanvasFilter(options.target),
    currentFilter,
    context = options.target.getContext("2d");

  function drawVideoFrame(video) {
    context.drawImage(video, 0, 0, options.target.width, options.target.height);
    if (currentFilter) {
      filter.apply(currentFilter);
    }
  }

  function setFilter(filter) {
    switch (filter) {
      case "grayscale":
        currentFilter = EffectPlayer.GRAYSCALE;
        break;
      case "threshold":
        currentFilter = EffectPlayer.THRESHOLD;
        break;
      case "brighten":
        currentFilter = EffectPlayer.BRIGHTEN;
        break;
      default:
        break;
    }
  }

  function clearFilter() {
    currentFilter = undefined;
  }

  that.drawVideoFrame = drawVideoFrame;
  that.setFilter = setFilter;
  that.clearFilter = clearFilter;
  return that;
};
