/* eslint-env browser  */
/* global MMEventTarget */

var Painter = Painter || {};
Painter.ImageDropZone = function(options) {
  "use strict";
  var that = new MMEventTarget(),
    target,
    fileTypes;

  function handleFileDrop(file) {
    if (fileTypes.includes(file.type)) {
      that.dispatchEvent({
        type: "imageDropped", 
        data: file,
      });
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
    fileTypes = options.fileTypes;
    target = options.target;
    target.addEventListener("dragover", onDragOver);
    target.addEventListener("dragleave", onDragLeave);
    target.addEventListener("drop", onDrop);
  }

  init();
  return that;
};
