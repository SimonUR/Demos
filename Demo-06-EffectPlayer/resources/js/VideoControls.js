/* eslint-env browser */

var EffectPlayer = EffectPlayer || {};
EffectPlayer.VideoControls = function(options) {
  "use strict";

  var that = new EffectPlayer.Controls(options);

  function init() {
    options.play.classList.add("video-controls-play-button");
    options.play.addEventListener("click", that.onButtonClicked);
    options.pause.classList.add("video-controls-pause-button");
    options.pause.addEventListener("click", that.onButtonClicked);
    options.stop.classList.add("video-controls-stop-button");
    options.stop.addEventListener("click", that.onButtonClicked);
    options.loop.classList.add("video-controls-loop-button");
    options.loop.addEventListener("click", that.onButtonClicked);
  }

  init();
  return that;
};
