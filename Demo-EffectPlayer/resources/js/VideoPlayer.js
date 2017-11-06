/* eslint-env browser */
/* global MMEventTarget */

var EffectPlayer = EffectPlayer || {};
EffectPlayer.VideoPlayer = function(el) {
  "use strict";

  var that = new MMEventTarget(),
    BROADCAST_INTERVAL_IN_MS = 40,
    broadcastInterval;

  function setFile(file) {
    var src = URL.createObjectURL(file);
    el.src = src;
  }

  function broadcastFrame() {
    that.dispatchEvent({
      type: "videoFrameAvailable",
      data: el,
    });
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
    return el.hasAttribute("src");
  }

  function play() {
    if (!isReady()) {
      return;
    }
    el.play();
    startBroadcasting();
    that.dispatchEvent({ type: "playbackStatusChanged", data: "play", });
  }

  function pause() {
    if (!isReady()) {
      return;
    }
    el.pause();
    stopBroadcasting();
    that.dispatchEvent({ type: "playbackStatusChanged", data: "pause", });
  }

  function stop() {
    if (!isReady()) {
      return;
    }
    el.pause();
    el.currentTime = 0;
    stopBroadcasting();
    that.dispatchEvent({ type: "playbackStatusChanged", data: "stop", });
  }

  function broadCastCurrentLoopMode() {
    var currentMode = el.loop ? "loop" : "no-loop";
    that.dispatchEvent({ type: "videoLoopModeChanged", data: currentMode,});
  }

  function toogleLoopMode() {
    el.loop = !el.loop;
    broadCastCurrentLoopMode();
  }

  function setLoopMode(mode) {
    switch (mode) {
      case "loop":
        el.loop = true;
        break;
      case "no-loop":
        el.loop = false;
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
