/* eslint-env browser  */
/* global EventPublisher */

var DropTarget = function(options) { // eslint-disable-line no-unused-vars
  "use strict";
  var that = new EventPublisher(),
    target = options.target;

  function handleFileDrop(file) {
    switch (file.type) {
      case "image/jpeg":
      case "image/jpg":
      case "image/png":
        that.notifyAll("imagedropped", file);
        break;
      default:
        break;
    }
  }

  function onDragOver(event) {
    target.classList.add(options.hoverClass);
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave() {
    target.classList.remove(options.hoverClass);
  }

  function onDrop(event) {
    var file = event.dataTransfer.files[0];
    target.classList.remove(options.hoverClass);
    event.stopPropagation();
    event.preventDefault();
    if (file) {
      handleFileDrop(file);
    }
  }

  function init() {
    target.addEventListener("dragover", onDragOver);
    target.addEventListener("dragleave", onDragLeave);
    target.addEventListener("drop", onDrop);
  }

  init();
  return that;
};
