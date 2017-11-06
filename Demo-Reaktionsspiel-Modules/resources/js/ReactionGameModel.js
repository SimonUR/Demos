/* eslint-env browser */
/* global ReactionGame */

ReactionGame.GameModel = function() {
  "use strict";

  const LIGHT_SWITCH_ON_PROBABILITY = 0.5,
    LIGHT_SWITCH_INTERVAL_DURATION = 750,
    REACTION_TIME_THRESHOLD = 300;
  var that = {},
    listeners = {},
    lightIsOn,
    points,
    lastUpdateTime,
    gameTick;

  function addEventListener(type, callback) {
    if (listeners[type] === undefined) {
      listeners[type] = [];
    }
    listeners[type].push(callback);
  }

  function dispatchEvent(type, msg) {
    if (listeners[type] === undefined) {
      return;
    }
    for (let i = 0; i < listeners[type].length; i++) {
      listeners[type][i](msg);
    }
  }

  function onTick() {
    var rand = Math.random();
    if (rand < LIGHT_SWITCH_ON_PROBABILITY) {
      lastUpdateTime = Date.now();
      lightIsOn = true;
      dispatchEvent("lightSwitchedOn");
    } else {
      lastUpdateTime = -1;
      lightIsOn = false;
      dispatchEvent("lightsSwitchedOff");
    }
  }

  function start() {
    lightIsOn = false;
    points = 0;
    lastUpdateTime = -1;
    gameTick = setInterval(onTick, LIGHT_SWITCH_INTERVAL_DURATION);
  }

  function stop() {
    clearInterval(gameTick);
  }

  function handleUserInput() {
    if (lightIsOn) {
      let delta = Date.now() - lastUpdateTime;
      if (delta <= REACTION_TIME_THRESHOLD) {
        points++;
        dispatchEvent("userScored", { time: delta, points: points, });
      } else {
        dispatchEvent("userFailed", { time: delta, points: points, });
      }
    } else {
      dispatchEvent("userInputWhileLightsOff", {points: points, });
      points--;
    }
  }

  that.addEventListener = addEventListener;
  that.start = start;
  that.stop = stop;
  that.handleUserInput = handleUserInput;
  return that;
};
