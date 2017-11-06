/* eslint-env browser */

var EffectPlayer = EffectPlayer || {};
EffectPlayer.FilterControls = function(options) {
  "use strict";

  var that = new EffectPlayer.Controls(options);

  function init() {
    options.grayscale.classList.add("filter-controls-grayscale-button");
    options.grayscale.addEventListener("click", that.onButtonClicked);
    options.brighten.classList.add("filter-controls-brighten-button");
    options.brighten.addEventListener("click", that.onButtonClicked);
    options.threshold.classList.add("filter-controls-threshold-button");
    options.threshold.addEventListener("click", that.onButtonClicked);
  }

  init();
  return that;
};
