/* eslint-env browser */
/* global request, MMEventTarget */

var MensaApp = MensaApp || {};
MensaApp.DataProvider = function() {
  "use strict";

  const API_URL = "http://132.199.139.24:9001/mensa/uni/{{day}}";
  var that = new MMEventTarget(),
    data = {};

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

  function onNewDataAvailable(day, menuData) {
    var completeDataIsAvailable = false;
    data[day.id] = JSON.parse(menuData);
    completeDataIsAvailable = checkForCompleteData();
    if (completeDataIsAvailable) {
      that.dispatchEvent({
        type: "dataAvailable",
        data: {
          getMenuForDay: getMenuForDay,
        },
      });
    }
  }

  function getMenuForDay(day) {
    return data[day.id];
  }

  function update() {
    data = {};
    for (let day in MensaApp.WEEKDAYS) {
      if (MensaApp.WEEKDAYS.hasOwnProperty(day)) {
        let options = {
          url: API_URL.replace("{{day}}", MensaApp.WEEKDAYS[day].id),
          success: onNewDataAvailable.bind(this, MensaApp.WEEKDAYS[day]),
        };
        request(options);
      }
    }
  }

  that.update = update;
  return that;
};
