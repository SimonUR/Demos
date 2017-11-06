/* eslint-env browser */

var ColorClicker = (function() {
  "use strict";
  var that = {},
    game,
    view;

  function init() {
    view = new ColorClicker.ColorClickerView();
    view.init(document.querySelector("#board"), document.querySelector(".level"));
    view.setOnBoxClickedListener(onBoxClicked);
    game = new ColorClicker.ColorClickerGame();
    game.setNewRoundStartListener(onNewRoundStarted);
    game.start();
  }

  function onNewRoundStarted(state) {
    view.render(state);
  }

  function onBoxClicked(box) {
    game.checkIfBoxIsTarget(box);
  }

  that.init = init;
  return that;
}());