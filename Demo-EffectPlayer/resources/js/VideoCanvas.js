/* eslint-env browser */
/* global MMEventTarget */

var EffectPlayer = EffectPlayer || {};
EffectPlayer.VideoCanvas = function(el) {
  "use strict";

  var that = new MMEventTarget(),
    filter = new EffectPlayer.CanvasFilter(el),
    currentFilter,
    context = el.getContext("2d");

  function drawVideoFrame(video) {
    context.drawImage(video, 0, 0, el.width, el.height);
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
