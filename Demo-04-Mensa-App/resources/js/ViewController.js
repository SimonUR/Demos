/* eslint-env browser */
/* global MensaApp, MMEventTarget */

MensaApp.ViewController = function(options) {
  "use strict";
  var that = new MMEventTarget(),
    messageBuilder,
    messageView,
    selectorView;

  function onDaySelectorClicked(event) {
    var target = event.target;
    if (target.classList.contains("week-day-selector")) {
      setSelectedDay(target);
    }
  }

  function setMenu(menu) {
    let text = messageBuilder.createMenuMessage(menu);
    messageView.innerHTML = text;
  }

  function selectDay(day) {
    var target = selectorView.querySelector("[data-weekday=" + day.name + "]");
    if (target) {
      setSelectedDay(target);
    }
  }

  function setSelectedDay(target) {
    let day = MensaApp.WEEKDAYS[target.getAttribute("data-weekday")];
    clearSelection();
    target.classList.add("active");
    that.dispatchEvent({
      type: "daySelected",
      data: day,
    });
  }

  function clearSelection() {
    for (let i = 0; i < selectorView.children.length; i++) {
      selectorView.children.item(i).classList.remove("active");
    }
  }

  function init() {
    messageBuilder = options.messageBuilder;
    messageView = options.messageView;
    selectorView = options.selectorView;
    selectorView.addEventListener("click", onDaySelectorClicked);
    return that;
  }

  that.init = init;
  that.setMenu = setMenu;
  that.selectDay = selectDay;
  return that;
};
