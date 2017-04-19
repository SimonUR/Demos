/* eslint-env browser */

var MensaApp = MensaApp || {};
MensaApp.DaySelector = (function() {
  "use strict";

  var that = {},
    onDaySelectedListener,
    selectorParent,
    selectorChilds;

  function onDaySelectorClicked(event) {
    var target = event.target;
    if (target.classList.contains("week-day-selector")) {
      selectDayElement(target);
    }
  }

  function selectDayElement(element) {
    var day;
    day = element.getAttribute("data-weekday");
    clearSelection();
    element.classList.add("active");
    if (onDaySelectedListener) {
      onDaySelectedListener(day);
    }
  }

  function selectDayByName(name) {
    var target = selectorParent.querySelector("[data-weekday=" + name + "]");
    if (target) {
      selectDayElement(target);
    }
  }

  function clearSelection() {
    for (let i = 0; i < selectorChilds.length; i++) {
      selectorChilds[i].classList.remove("active");
    }
  }

  function init(el) {
    selectorParent = el;
    selectorParent.addEventListener("click", onDaySelectorClicked);
    selectorChilds = selectorParent.querySelectorAll(".week-day-selector");
  }

  function setOnDaySelectedListener(listener) {
    onDaySelectedListener = listener;
  }

  that.init = init;
  that.setOnDaySelectedListener = setOnDaySelectedListener;
  that.selectDayByName = selectDayByName;
  return that;
}());
