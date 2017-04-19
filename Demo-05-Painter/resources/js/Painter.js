/* eslint-env browser  */
var Painter = (function() {
  "use strict";

  var model,
    canvas,
    toolbox,
    palette;

  function onToolSelected(event) {
    model.setTool(event.data);
  }

  function onColorSelected(event) {
    model.setColor(event.data);
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

  function init() {
    initModel();
    initCanvas();
    initPalette();
    initToolbox();
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
    toolbox.init(document.querySelector(".tools"));
    toolbox.addEventListener("toolSelected", onToolSelected);
    toolbox.addEventListener("actionSelected", onActionSelected);
    toolbox.setDefault();
  }

  return {
    init: init,
  };
}());
