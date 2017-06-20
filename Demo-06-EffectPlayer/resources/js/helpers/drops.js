/* eslint-env browser */
/* global MMEventTarget */

(function(context) {
  "use strict";

  var DropZone = DropZone || function(el, fileTypes) {
    MMEventTarget.call(this);
    this.el = el;
    this.fileTypes = fileTypes;
    this.highlightClass = "dropzone-highlighted";
    this.el.addEventListener("dragover", this.onDragOver.bind(this));
    this.el.addEventListener("dragleave", this.onDragLeave.bind(this));
    this.el.addEventListener("drop", this.onDrop.bind(this));
  };

  DropZone.prototype = Object.create(MMEventTarget.prototype);
  DropZone.prototype.constructor = DropZone;

  DropZone.prototype.handleFileDrop = function(file) {
    if (this.fileTypes.includes(file.type)) {
      this.dispatchEvent({
        type: "fileDropped",
        data: file,
      });
    }
  };

  DropZone.prototype.onDragOver = function(event) {
    this.el.classList.add(this.highlightClass);
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  DropZone.prototype.onDragLeave = function() {  
    this.el.classList.remove(this.highlightClass);
  };

  DropZone.prototype.onDrop = function(event) {
    var file = event.dataTransfer.files[0];
    this.el.classList.remove(this.highlightClass);
    event.stopPropagation();
    event.preventDefault();
    if (file) {
      this.handleFileDrop(file);
    }
  };

  DropZone.prototype.show = function() {
    this.el.classList.remove("hidden");
  };

  DropZone.prototype.hide = function() {
    this.el.classList.add("hidden");
  };

  context.MMEDropZone = DropZone;

}(window));