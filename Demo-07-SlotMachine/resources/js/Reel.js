/* eslint-env browser  */
/* global EventPublisher */

var SlotMachineGame = SlotMachineGame || {};
SlotMachineGame.Reel = function(reelNode) {
  "use strict";

  const MIN_TIME_FAST = 3000,
    MAX_TIME_FAST = 7000,
    TIME_MEDIUM = 2000,
    TIME_SLOW = 1000,
    SOUND_PLAYBACK_RATE_FAST = 2,
    SOUND_PLAYBACK_RATE_MEDIUM = 1.5,
    SOUND_PLAYBACK_RATE_SLOW = 1,
    SLOT_VALUES = ["lemon", "melon", "plum", "cherry", "seven",];

  var that = new EventPublisher(),
    sound = new Audio("./resources/sounds/clock-ticking.mp3"),
    currentValue = "stopped";

  function onStop(lastSpeed) {
    switch (lastSpeed) {
      case "fast":
        sound.playbackRate = SOUND_PLAYBACK_RATE_MEDIUM;
        setReelSpeedAndDuration("medium", TIME_MEDIUM);
        break;
      case "medium":
        sound.playbackRate = SOUND_PLAYBACK_RATE_SLOW;
        setReelSpeedAndDuration("slow", TIME_SLOW);
        break;
      case "slow":
        stopReel();
        break;
      default:
        break;
    }
  }

  function clearNodeClasses() {
    reelNode.classList.remove("move-slow", "move-medium", "move-fast",
      "move-finish", "move-to-seven", "move-to-lemon", "move-to-melon",
      "move-to-plum", "move-to-cherry");
  }

  function startReel(delay) {
    var initalSpeed = Math.floor(Math.random() * (MAX_TIME_FAST -
        MIN_TIME_FAST)) + MIN_TIME_FAST,
      startDelay = delay || 0;
    currentValue = "moving";
    sound.playLoop(SOUND_PLAYBACK_RATE_FAST);
    setTimeout(setReelSpeedAndDuration.bind(this, "fast", initalSpeed),
      startDelay);
  }

  function getValue() {
    return currentValue;
  }

  function setReelSpeedAndDuration(speed, duration) {
    clearNodeClasses();
    reelNode.classList.add("move-" + speed);
    setTimeout(onStop.bind(this, speed), duration);
  }

  function stopReel() {
    var backgroundPosition = window.getComputedStyle(reelNode, null).backgroundPosition;
    backgroundPosition = backgroundPosition.trim().replace(/px/g, "").split(
      " ")[1];
    currentValue = detectCurrentValue(backgroundPosition);
    stopReelAtValue(currentValue);
    sound.rewind();
  }

  function detectCurrentValue(position) {
    var value;
    /* eslint-disable no-magic-numbers */
    switch (Math.round(position / 100)) {
      case -1:
        value = SLOT_VALUES[0];
        break;
      case -2:
        value = SLOT_VALUES[1];
        break;
      case -3:
        value = SLOT_VALUES[2];
        break;
      case -4:
        value = SLOT_VALUES[3];
        break;
      case -5:
        value = SLOT_VALUES[4];
        break;
      default:
        value = "stopped";
        break;
    }
    /* eslint-enable no-magic-numbers */
    return value;
  }

  function stopReelAtValue(value) {
    clearNodeClasses();
    reelNode.classList.add("move-finish", "move-to-" + value);
    that.notifyAll("reelStopped", that);
  }

  that.start = startReel;
  that.getValue = getValue;
  return that;
};
