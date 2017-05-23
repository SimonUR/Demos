/* eslint-env browser */

var MensaApp = MensaApp || {};
MensaApp = (function() {
  "use strict";

  var that = {},
    dataProvider,
    menu,
    view;

  function onDaySelected(event) {
    let daysMenu = menu.getMenuForDay(event.data);
    view.setMenu(daysMenu);
  }

  function onDataAvailable(event) {
    menu = event.data;
    view.selectDay(MensaApp.WEEKDAYS.Monday);
  }

  function init() {
    initUserInterface();
    initDataProvider();
    dataProvider.update();
  }

  function initUserInterface() {
    let messageBuilder = new MensaApp.MessageBuilder();
    view = new MensaApp.ViewController({
      messageBuilder: messageBuilder,
      messageView: document.querySelector(".todays-menu .text"),
      selectorView: document.querySelector(".week-day-selectors"),
    }).init();
    view.addEventListener("daySelected", onDaySelected);
  }

  function initDataProvider() {
    dataProvider = new MensaApp.DataProvider();
    dataProvider.addEventListener("dataAvailable", onDataAvailable);
  }

  that.init = init;
  return that;
}());
