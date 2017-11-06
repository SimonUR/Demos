/* eslint-env browser */

var ReactionGame = (function() {
  "use strict";
  var that = {},
    view,
    game;

  function init() {
    initView();
    initGame();
    game.start();
  }

  function initView() {
    view = ReactionGame.GameView({
      lights: document.querySelectorAll(".light"),
      results: document.querySelector(".result"),
      points: document.querySelector(".points"),
    });
    document.addEventListener("keypress", onKeyPressed);
  }

  function initGame() {
    game = new ReactionGame.GameModel();
    game.addEventListener("userScored", onUserScored);
    game.addEventListener("userFailed", onUserFailed);
    game.addEventListener("userInputWhileLightsOff",
      onUserInputWhileLightsOff);
    game.addEventListener("lightSwitchedOn", onLightSwitchedOn);
    game.addEventListener("lightsSwitchedOff", onLightsSwitchedOff);
  }

  function onKeyPressed() {
    if (event.code === "Space") {
      game.handleUserInput();
    }
  }

  function onUserScored(event) {
    view.setPoints(event.points);
    view.setResultText("An excellent reaction: " + event.time + "ms");
  }

  function onUserFailed(event) {
    view.setPoints(event.points);
    view.setResultText("An embarrassing reaction: " + event.time + "ms");
  }

  function onUserInputWhileLightsOff(event) {
    view.setPoints(event.points);
    view.setResultText("Where did you see that light?");
  }

  function onLightSwitchedOn() {
    view.switchAllLightsOff();
    view.switchRandomLightOn();
  }

  function onLightsSwitchedOff() {
    view.switchAllLightsOff();
  }

  that.init = init;
  return that;
}());
