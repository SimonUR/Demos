/* eslint-env browser */
/* global request */

var request = request || (function() {
  "use strict";

  const READY_STATE_UNITIALIZED = 0,
    READY_STATE_CONNECTED = 1,
    READY_STATE_SERVER_RECEIVED_REQUEST = 2,
    READY_STATE_SERVER_PROCESSING_REQUEST = 3,
    READY_STATE_RESPONSE_READY = 4,
    HTTP_CODE_OK = 200,
    HTTP_CODE_FORBIDDEN = 403,
    HTTP_CODE_NOT_FOUND = 404;
  var that = {};

  function foo() {
    return false;
  }

  function createAsyncXMLHttpRequest(url, method, onSuccess, onError) {
    var requestMethod = method || "GET",
      success = onSuccess || foo,
      error = onError || foo,
      xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === READY_STATE_RESPONSE_READY) {
        switch (this.status) {
          case HTTP_CODE_OK:
            success(this.responseText);
            break;
          case HTTP_CODE_FORBIDDEN:
            error("HTTP Error 403: Access forbidden.");
            break;
          case HTTP_CODE_NOT_FOUND:
            error("HTTP Error 404: Document not found.");
            break;
          default:
            error("Unknown Error");
            break;
        }
      }
    };
    xmlhttp.open(requestMethod, url, true);
    return xmlhttp;
  }

  function requestDocument(method, options) {
    var request = createAsyncXMLHttpRequest(options.url, method, options.success,
      options.error);
    request.send();
  }

  that.get = requestDocument.bind(this, "GET");
  return that;
}());
