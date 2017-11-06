/* eslint-env browser */
/* global ColorClicker */

var ColorClicker = ColorClicker || {};
ColorClicker.ColorClickerView = function() {
  "use strict";
  var that = {},
    config = ColorClicker.Config,
    boxClickedListener,
    level,
    parent;

  function init(boardEl, levelEl) {
    parent = boardEl;
    level = levelEl;
    parent.addEventListener("click", onBoardClicked);
  }

  function render(state) {
    var boxes = state.boxes,
      boardFragment = document.createDocumentFragment(),
      boardWidth = calculateBoardWidth(boxes.length);
    clearBoard();
    for (let i = 0; i < boxes.length; i++) {
      let box = boxes[i],
        boxEl = createBoxElement(box);
      boardFragment.appendChild(boxEl);
    }
    parent.appendChild(boardFragment);
    parent.style.setProperty("width", boardWidth + "px");
    level.innerHTML = state.level;
  }

  function setOnBoxClickedListener(listener) {
    boxClickedListener = listener;
  }

  function onBoardClicked(event) {
    var el = event.target;
    if (!boxClickedListener) {
      return;
    }
    if (el.classList.contains("box")) {
      boxClickedListener({
        id: el.getAttribute("data-box-id"),
      });
    }
  }

  function clearBoard() {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  function calculateBoardWidth(numBoxes) {
    var boxesPerRow = Math.sqrt(numBoxes),
      boxWidth = getBoxWidth();
    if (boxesPerRow < config.minBoxPerRow) {
      boxesPerRow = numBoxes;
    }
    return boxesPerRow * boxWidth;
  }

  function getBoxWidth() {
    var boxEl = document.createElement("span"),
      boxWidth,
      style;
    boxEl.classList.add("box");
    boxEl.style.setProperty("visibility", "hidden");
    parent.appendChild(boxEl);
    style = window.getComputedStyle(boxEl);
    boxWidth = boxEl.offsetWidth + parseFloat(style.marginLeft) + parseFloat(
      style.marginRight);
    parent.removeChild(boxEl);
    return boxWidth;
  }

  function createBoxElement(box) {
    var boxEl = document.createElement("span");
    boxEl.classList.add("box");
    boxEl.setAttribute("data-box-id", box.id);
    boxEl.style.setProperty("background-color", box.color.toCSS());
    return boxEl;
  }

  that.init = init;
  that.render = render;
  that.setOnBoxClickedListener = setOnBoxClickedListener;
  return that;
};