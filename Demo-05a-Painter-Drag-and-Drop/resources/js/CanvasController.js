/* eslint-env browser  */

var Painter = Painter || {};
Painter.CanvasController = function() {
  "use strict";

  var that = {},
    canvas,
    context,
    options,
    savedStates = [],
    mouse = {
      lastX: -1,
      lastY: -1,
      clicked: false,
    };

  function saveState() {
    savedStates.push(getDataUrl());
  }

  function restoreState(state) {
    var image;
    if (state === undefined) {
      return;
    }
    image = new Image();
    image.addEventListener("load", function() {
      clear();
      drawImage(image, 0, 0);
    });
    image.src = state;
  }

  function drawImage(img, x, y, width, height) {
    var w = width | img.width,
      h = height | img.height;
    context.drawImage(img, x, y, w, h);
  }

  function drawLine(start, end) {
    if (start.x === -1 || start.y === -1) {
      return;
    }
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.strokeStyle = options.color;
    context.lineWidth = options.weight;
    context.stroke();
    context.closePath();
  }

  function drawCircle(center) {
    context.beginPath();
    context.fillStyle = options.color;
    context.arc(center.x, center.y, options.radius, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  }

  function drawRect(center) {
    context.beginPath();
    context.fillStyle = options.color;
    context.rect(center.x - options.width / 2, center.y - options.width / 2,
      options.width, options.width);
    context.fill();
    context.closePath();
  }

  function erase(center) {
    context.clearRect(center.x - options.width / 2, center.y - options.width /
      2, options.width, options.width);
  }

  function updateMouseInformation(x, y, clicked) {
    mouse.lastX = x;
    mouse.lastY = y;
    mouse.clicked = clicked;
  }

  function onMouseMovedInCanvas(event) {
    if (!mouse.clicked) {
      return;
    }
    switch (options.tool) {
      case "line":
        drawLine({
          x: mouse.lastX,
          y: mouse.lastY,
        }, {
          x: event.offsetX,
          y: event.offsetY,
        });
        break;
      case "eraser":
        erase({
          x: event.offsetX,
          y: event.offsetY,
        });
        break;
      default:
        break;
    }
    updateMouseInformation(event.offsetX, event.offsetY, mouse.clicked);
  }

  function onMouseLeftCanvas() {
    updateMouseInformation(-1, -1, false);
  }

  function onMouseDownInCanvas(event) {
    saveState();
    updateMouseInformation(event.offsetX, event.offsetY, true);
    switch (options.tool) {
      case "circle":
        drawCircle({
          x: event.offsetX,
          y: event.offsetY,
        });
        break;
      case "square":
        drawRect({
          x: event.offsetX,
          y: event.offsetY,
        });
        break;
      default:
        break;
    }
  }

  function onMouseUpInCanvas(event) {
    updateMouseInformation(event.offsetX, event.offsetY, false);
  }

  function clear(clearStates) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (clearStates) {
      savedStates = [];
    }
  }

  function undo() {
    restoreState(savedStates.pop());
  }

  function getDataUrl() {
    return canvas.toDataURL();
  }

  function setOptions(newOptions) {
    options = newOptions;
  }

  function resizeImageToCanvas(img) {
    var ratio, orientation = img.width > img.height ? "landscape" :
      "portrait";
    if (orientation === "landscape") {
      if (img.width > canvas.width) {
        ratio = canvas.width / img.width;
        img.setAttribute("width", canvas.width);
        img.setAttribute("height", Math.floor(canvas.height * ratio));
      }
    } else {
      if (img.height > canvas.height) {
        ratio = canvas.height / img.height;
        img.setAttribute("width", Math.floor(canvas.width * ratio));
        img.setAttribute("height", canvas.height);
      }
    }
    return img;
  }

  function setBackgroundImage(file, center) {
    var x = 0,
      y = 0,
      img = new Image();
    img.onload = function() {
      img = resizeImageToCanvas(img);
      if (center === true) {
        x = (canvas.width - img.width) / 2;
        y = (canvas.height - img.height) / 2;
      }
      drawImage(img, x, y);
    };
    img.src = URL.createObjectURL(file);
  }

  function init(canvasNode) {
    canvas = canvasNode;
    context = canvas.getContext("2d");
    canvas.addEventListener("mousemove", onMouseMovedInCanvas);
    canvas.addEventListener("mouseleave", onMouseLeftCanvas);
    canvas.addEventListener("mousedown", onMouseDownInCanvas);
    canvas.addEventListener("mouseup", onMouseUpInCanvas);
  }

  that.init = init;
  that.setOptions = setOptions;
  that.setBackgroundImage = setBackgroundImage;
  that.getImage = getDataUrl;
  that.clear = clear;
  that.undo = undo;
  return that;
};
