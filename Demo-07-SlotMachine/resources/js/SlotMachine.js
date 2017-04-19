/* eslint-env browser  */

var SlotMachineGame = SlotMachineGame || {};
SlotMachineGame.SlotMachine = function(options) {
  "use strict";

  var that = {},
    playing,
    reels,
    results,
    sounds;

  function onAllReelsStopped() {
    var playerHasWon = results.every(function(element) {
      return element === results[0];
    });
    if (playerHasWon) {
      sounds.win.play();
    } else {
      sounds.lose.play();
    }
  }

  function onReelStopped(event) {
    results.push(event.data.getValue());
    if (results.length === reels.length) {
      onAllReelsStopped();
    }
  }

  function reset() {
    results = [];
    playing = false;
    sounds.win.rewind();
    sounds.lose.rewind();
  }

  function play() {
    if (playing) {
      return;
    }
    reels.forEach(function(reel, positon) {
      reel.start(positon * options.reelStartDelay);
    });
    playing = true;
  }

  function init() {
    initSounds();
    initReels();
    reset();
  }

  function initSounds() {
    sounds = {
      win: new Audio(options.winSound),
      lose: new Audio(options.loseSound),
    };
    sounds.win.addEventListener("ended", reset);
    sounds.lose.addEventListener("ended", reset);
  }

  function initReels() {
    reels = [];
    options.reelSelectors.forEach(function(selector) {
      reels.push(new SlotMachineGame.Reel(document.querySelector(selector)));
      reels[reels.length - 1].addEventListener("reelStopped",
        onReelStopped);
    });
  }

  that.init = init;
  that.play = play;
  return that;
};
