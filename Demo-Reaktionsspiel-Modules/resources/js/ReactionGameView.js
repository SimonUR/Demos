/* eslint-env browser */
/* global ReactionGame */

ReactionGame.GameView = function(elements) {
  "use strict";
  const LIGHT_STATE_ON = "on",
    LIGHT_STATE_OFF = "off";
  var that = {};

  function switchAllLightsOff() {
    for (let el of elements.lights) {
      el.classList.remove(LIGHT_STATE_ON);
      el.classList.add(LIGHT_STATE_OFF);
    }
  }

  function switchRandomLightOn() {
    var index = Math.floor(Math.random() * elements.lights.length),
      randomLight = elements.lights.item(index);
    randomLight.classList.remove(LIGHT_STATE_OFF);
    randomLight.classList.add(LIGHT_STATE_ON);
  }

  function setPoints(points) {
    elements.points.innerHTML = points;
  }

  function setResultText(text) {
    elements.results.innerHTML = text;
  }

  that.switchAllLightsOff = switchAllLightsOff;
  that.switchRandomLightOn = switchRandomLightOn;
  that.setPoints = setPoints;
  that.setResultText = setResultText;
  return that;
};
