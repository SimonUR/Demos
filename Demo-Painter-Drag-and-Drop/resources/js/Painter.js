/* eslint-env browser  */
var Painter = (function() {
  "use strict";

  var that = {},
    model,
    canvas,
    toolbox,
    palette,
    dropZone;

  function onToolSelected(event) {
    model.setTool(event.data);
  }

  function onColorSelected(event) {
    model.setColor(event.data);
  }

  function onSizeChanged(event) {
    model.setSize(event.data);
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

  function onImageDroppedCanvas(event) {
    canvas.setBackgroundImage(event.data);
  }

  function init() {
    initModel();
    initCanvas();
    initPalette();
    initToolbox();
    initDropZone();
  }

  function initModel() {
    model = new Painter.PainterModel();
    model.addEventListener("optionsChanged", onOptionsChanged);
  }

  function initCanvas() {
    var canvasEl = document.querySelector(".canvas");
    canvas = new Painter.CanvasController(canvasEl);
  }

  function initPalette() {
    var colorsEl = document.querySelector(".colors");
    palette = new Painter.PaletteViewController(colorsEl);
    palette.addEventListener("colorSelected", onColorSelected);
    palette.setDefault();
  }

  function initToolbox() {
    var toolsEl = document.querySelector(".tools");
    toolbox = new Painter.ToolboxViewController(toolsEl);
    toolbox.addEventListener("toolSelected", onToolSelected);
    toolbox.addEventListener("actionSelected", onActionSelected);
    toolbox.addEventListener("sizeChanged", onSizeChanged);
    toolbox.setDefault();
  }

  function initDropZone() {
    var dropZoneEl = document.querySelector(".canvas");
    dropZone = new Painter.ImageDropZone({
      target: dropZoneEl,
      hoverClass: "highlighted",
      fileTypes: ["image/jpg", "image/jpeg", "image/png", ],
    });
    dropZone.addEventListener("imageDropped", onImageDroppedCanvas);
  }

  that.init = init;
  return that;
}());
