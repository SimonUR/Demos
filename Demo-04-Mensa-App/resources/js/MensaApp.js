/* eslint-env browser */

var MensaApp = MensaApp || {};
MensaApp = (function() {
  "use strict";

  const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", ];
  var that = {},
    messageView;

  function onDaySelected(weekday) {
    showDataForWeekday(weekday);
  }

  function selectToday() {
    var dayIndex = new Date().getDay(),
      weekday;
    if (dayIndex > 0 && dayIndex < 6) {
      weekday = WEEKDAYS[dayIndex - 1];
    } else {
      weekday = WEEKDAYS[0];
    }
    MensaApp.DaySelector.selectDayByName(weekday);
  }

  function showDataForWeekday(weekday) {
    var data,
      message;
    switch (weekday) {
      case "monday":
        data = MensaApp.DataProvider.getMenuForMonday();
        break;
      case "tuesday":
        data = MensaApp.DataProvider.getMenuForTuesday();
        break;
      case "wednesday":
        data = MensaApp.DataProvider.getMenuForWednesday();
        break;
      case "thursday":
        data = MensaApp.DataProvider.getMenuForThursday();
        break;
      case "friday":
        data = MensaApp.DataProvider.getMenuForFriday();
        break;
      default:
        break;
    }
    if (data) {
      message = MensaApp.MessageGenerator.createMenuMessage(data);
      messageView.innerHTML = message;
    }
  }

  function onProviderUpdated() {
    selectToday();
  }

  function init() {
    initUserInterface();
    initDataProvider();
  }

  function initUserInterface() {
    var daySelector = document.querySelector(".week-day-selectors");
    messageView = document.querySelector(".todays-menu .text");
    MensaApp.DaySelector.init(daySelector);
    MensaApp.DaySelector.setOnDaySelectedListener(onDaySelected);
  }

  function initDataProvider() {
    MensaApp.DataProvider.update(onProviderUpdated);
  }

  that.init = init;
  return that;
}());
