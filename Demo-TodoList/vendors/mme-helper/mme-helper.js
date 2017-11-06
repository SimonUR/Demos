/* eslint-env browser */
(function(context) {
  "use strict";
  var MME = {};

  /**
   * Returns a string formatted representation of a given date. Certain placeholders in the 
   * given format string are replaced by values from the date object.
   *   D: UTCDate
   *   M: UTCMonth+1
   *   YYYY: UTCFUllYear
   *   h: UTCHours
   *   m: UTCMinutes
   *   s: UTCSeconds 
   * @param  {Date} date Date to be formatted as string
   * @param  {String} format Format string
   * @return {String} Formatted date as a string
   */
  function getFormattedDate(date, format) {
    var result = format,
      hours = (date.getUTCHours() >= 10) ? date.getUTCHours() : "0" + date
      .getUTCHours(),
      minutes = (date.getUTCMinutes() >= 10) ? date.getUTCMinutes() : "0" + date
      .getUTCMinutes(),
      seconds = (date.getUTCSeconds() >= 10) ? date.getUTCSeconds() : "0" + date
      .getUTCSeconds();
    result = result.replace("D", date.getUTCDate());
    result = result.replace("M", date.getUTCMonth() + 1);
    result = result.replace("YYYY", date.getUTCFullYear());
    result = result.replace("h", hours);
    result = result.replace("m", minutes);
    result = result.replace("s", seconds);
    return result;
  }

  function requestFile(url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function(event) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onSuccess(xhr.responseText, event);
        } else {
          onError(xhr.statusText);
        }
      }
    };
    xhr.onerror = function(event) {
      onError(xhr.statusText, event);
    };
    xhr.send(null);
  }

  /**
   * Returns the file content as a javascript object or null
   * @param  {String}   url      Url specifing the requested file
   * @param  {Function} callback Callback to return result
   * @return {Object} The parsed javascript object or null if file could not be loaded
   */
  function loadJSON(url, callback) {
    requestFile(url, function(result) {
      callback(JSON.parse(result));
    }, function() {
      callback(null);
    });
  }

  MME.JSON = {
    loadJSON: loadJSON,
  };

  MME.TIME = {
    getFormattedDate: getFormattedDate,
  };

  context.MME = MME;
}(window));
