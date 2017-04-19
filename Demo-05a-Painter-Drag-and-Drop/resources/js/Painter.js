/* eslint-env browser  */
/* global DropTarget */

var Painter = (function() {
  "use strict";

  var model,
    canvas,
    toolbox,
    palette,
    dropTarget;

  function onToolSelected(event) {
    model.setTool(event.data);
  }

  function onColorSelected(event) {
    model.setColor(event.data);
  }

  function onToolSizeChanged(event) {
    var value = parseInt(event.data);
    model.setWidth(value);
    model.setRadius(value);
    model.setWeight(value);
  }

  function onActionSelected(event) {
    switch (event.data) {
      case "new":
        canvas.clear();
        break;
      case "save":
        window.open(canvas.getImage());
        break;
      case "undo":
        canvas.undo();
        break;
      default:
        break;
    }
  }

  function onOptionsChanged(event) {
    canvas.setOptions(event.data);
  }

  function onImageDropped(event) {
    canvas.setBackgroundImage(event.data, true);
  }

  function init() {
    initModel();
    initCanvas();
    initPalette();
    initToolbox();
    initDragAndDrop();
  }

  function initModel() {
    model = new Painter.PainterModel();
    model.addEventListener("optionsChanged", onOptionsChanged);
  }

  function initCanvas() {
    canvas = new Painter.CanvasController();
    canvas.init(document.querySelector(".canvas"));
  }

  function initPalette() {
    palette = new Painter.PaletteView();
    palette.init(document.querySelector(".colors"));
    palette.addEventListener("colorSelected", onColorSelected);
    palette.setDefault();
  }

  function initToolbox() {
    toolbox = new Painter.ToolboxView();
    toolbox.init(document.querySelector(".tools"), document.querySelector(
      ".tool-resizer"));
    toolbox.addEventListener("toolSelected", onToolSelected);
    toolbox.addEventListener("actionSelected", onActionSelected);
    toolbox.addEventListener("toolSizeChanged", onToolSizeChanged);
    toolbox.setDefault();
  }

  function initDragAndDrop() {
    dropTarget = new DropTarget({
      target: document.querySelector("#drop-target-1"),
      hoverClass: "drop-target-active",
    });
    dropTarget.addEventListener("imagedropped", onImageDropped);
  }

  return {
    init: init,
  };
}());
