/* eslint-env browser */
/* global request */

var MensaApp = MensaApp || {};
MensaApp.DataProvider = (function() {
  "use strict";

  const WEEKDAYS = ["mo", "di", "mi", "do", "fr", ],
    API_URL = "http://132.199.139.24:9001/mensa/uni/{{day}}";
  var that = {},
    data;

  function checkForCompleteData() {
    if (!data.hasOwnProperty("fr")) {
      return false;
    }
    if (!data.hasOwnProperty("do")) {
      return false;
    }
    if (!data.hasOwnProperty("mi")) {
      return false;
    }
    if (!data.hasOwnProperty("di")) {
      return false;
    }
    if (!data.hasOwnProperty("mo")) {
      return false;
    }
    return true;
  }

  function onNewDataAvailable(weekday, callback, dataForDay) {
    var completeDataIsAvailable = false;
    data[weekday] = JSON.parse(dataForDay);
    completeDataIsAvailable = checkForCompleteData();
    if (completeDataIsAvailable) {
      callback();
    }
  }

  function getMenuForWeekday(weekday) {
    return data[weekday];
  }

  function update(callback) {
    data = {};
    for (let i = 0; i < WEEKDAYS.length; i++) {
      let day = WEEKDAYS[i],
        options = {
          url: API_URL.replace("{{day}}", day),
          success: onNewDataAvailable.bind(this, day, callback),
        };
      request.get(options);
    }

  }

  that.update = update;
  that.getMenuForMonday = getMenuForWeekday.bind(this, "mo");
  that.getMenuForTuesday = getMenuForWeekday.bind(this, "di");
  that.getMenuForWednesday = getMenuForWeekday.bind(this, "mi");
  that.getMenuForThursday = getMenuForWeekday.bind(this, "do");
  that.getMenuForFriday = getMenuForWeekday.bind(this, "fr");
  return that;
}());
