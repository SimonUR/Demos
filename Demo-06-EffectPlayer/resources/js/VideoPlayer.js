/* eslint-env browser */
/* global EventPublisher */

var EffectPlayer = EffectPlayer || {};
EffectPlayer.VideoPlayer = function(options) {
  "use strict";

  var that = new EventPublisher(),
    BROADCAST_INTERVAL_IN_MS = 40,
    broadcastInterval,
    target = options.target;

  function setFile(file) {
    var src = URL.createObjectURL(file);
    target.src = src;
  }

  function broadcastFrame() {
    that.notifyAll("videoFrameAvailable", target);
  }

  function startBroadcasting() {
    if (broadcastInterval) {
      return;
    }
    broadcastInterval = setInterval(broadcastFrame, BROADCAST_INTERVAL_IN_MS);
  }

  function stopBroadcasting() {
    clearInterval(broadcastInterval);
    broadcastInterval = undefined;
  }

  function isReady() {
    return target.hasAttribute("src");
  }

  function play() {
    if (!isReady()) {
      return;
    }
    target.play();
    startBroadcasting();
    that.notifyAll("videoPlayed", null);
  }

  function pause() {
    if (!isReady()) {
      return;
    }
    target.pause();
    stopBroadcasting();
    that.notifyAll("videoPaused", null);
  }

  function stop() {
    if (!isReady()) {
      return;
    }
    target.pause();
    target.currentTime = 0;
    stopBroadcasting();
    that.notifyAll("videoStopped", null);
  }

  function broadCastCurrentLoopMode() {
    var currentMode = target.loop ? "loop" : "no-loop";
    that.notifyAll("videoLoopModeChanged", currentMode);
  }

  function toogleLoopMode() {
    target.loop = !target.loop;
    broadCastCurrentLoopMode();
  }

  function setLoopMode(mode) {
    switch (mode) {
      case "loop":
        target.loop = true;
        break;
      case "no-loop":
        target.loop = false;
        break;
      default:
        break;
    }
    broadCastCurrentLoopMode();
  }

  that.setFile = setFile;
  that.play = play;
  that.pause = pause;
  that.stop = stop;
  that.toogleLoopMode = toogleLoopMode;
  that.setLoopMode = setLoopMode;
  return that;
};
