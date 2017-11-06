/* eslint-env browser */
/* global MMEventTarget */

var EffectPlayer = EffectPlayer || {};
EffectPlayer.Controls = function(options) {
  "use strict";

  var that = new MMEventTarget();

  function onButtonClicked(event) {
    var prefixLength = 10,
      classString = event.target.getAttribute("class"),
      buttonType = classString.substring(classString.lastIndexOf(
        "-controls-") + prefixLength, classString.lastIndexOf(
        "-button"));
    that.dispatchEvent({
      type: "buttonPressed",
      data: buttonType,
    });
  }

  function clearButtonState(button) {
    options[button].classList.remove("active");
  }

  function setButtonState(button) {
    options[button].classList.add("active");
  }

  function toggleButtonState(button) {
    options[button].classList.toggle("active");
  }

  function getButtonState(button) {
    return options[button].classList.contains("active");
  }

  that.setButtonState = setButtonState;
  that.clearButtonState = clearButtonState;
  that.toggleButtonState = toggleButtonState;
  that.getButtonState = getButtonState;
  that.onButtonClicked = onButtonClicked;
  return that;
};
