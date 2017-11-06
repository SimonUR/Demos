/* eslint-env browser */

(function(context) {
  "use strict";

  var EventTarget = EventTarget || function() {
    this.listeners = {};
  };

  EventTarget.prototype.addEventListener = function(type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  };

  EventTarget.prototype.removeEventListener = function(type, callback) {
    if (!(type in this.listeners)) {
      return;
    }
    for (let i = 0, l = this.listeners[type].length; i < l; i++) {
      if (this.listeners[type][i] === callback) {
        this.listeners[type].splice(i, 1);
        return;
      }
    }
  };

  EventTarget.prototype.dispatchEvent = function(event) {
    if (!(event.type in this.listeners)) {
      return;
    }
    event.target = this;
    for (let i = 0, l = this.listeners[event.type].length; i < l; i++) {
      this.listeners[event.type][i].call(this, event);
    }
  };

  context.MMEventTarget = EventTarget;

}(window));
