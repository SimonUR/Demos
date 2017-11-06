/* eslint-env browser */
var Audio = Audio || {};

Audio.prototype.rewind = function() {
  "use strict";
  this.pause();
  this.currentTime = 0;
};

Audio.prototype.playLoop = function(playbackRate) {
  "use strict";
  this.playbackRate = playbackRate || 1;
  this.loop = true;
  this.play();
};
