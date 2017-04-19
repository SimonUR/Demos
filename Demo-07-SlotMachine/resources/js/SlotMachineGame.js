/* eslint-env browser  */
var SlotMachineGame = SlotMachineGame || (function() {
  "use strict";

  var slotMachine;

  function startSlotMachine() {
    slotMachine.play();
  }

  function init() {
    slotMachine = new SlotMachineGame.SlotMachine({
      winSound: "./resources/sounds/win.mp3",
      loseSound: "./resources/sounds/lose.mp3",
      reelSelectors: [".reel.first", ".reel.second", ".reel.third", ],
      reelStartDelay: 500,
    });
    slotMachine.init();
    document.querySelector(".button.start").addEventListener("click",
      startSlotMachine);
  }

  return {
    init: init,
  };
}());
