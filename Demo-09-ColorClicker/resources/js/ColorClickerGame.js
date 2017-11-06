/* eslint-env browser */
/* global ColorClicker */

var ColorClicker = ColorClicker || {};
ColorClicker.ColorClickerGame = function() {
  "use strict";
  var that = {},
    config = ColorClicker.Config,
    Color = ColorClicker.Color,
    currentLevel,
    currentBoxNumber,
    currentBoxes,
    currentDeviation,
    newRoundStartListener;

  function start() {
    resetGame();
    startNewRound();
  }

  function setNewRoundStartListener(listener) {
    newRoundStartListener = listener;
  }

  function checkIfBoxIsTarget(box) {
    var isTarget = currentBoxes[box.id].isTarget;
    if(isTarget) {
        increaseLevel();
        startNewRound();
    } else {
        resetGame();
        startNewRound();
    }
  }

  function resetGame() {
    currentLevel = 1;
    currentBoxNumber = config.boxesPerLevel[currentLevel-1];
    currentDeviation = config.defaultDeviation;
  }

  function increaseLevel() {
    currentLevel++;
    if(currentLevel > config.boxesPerLevel.length) {
        currentBoxNumber = config.boxesPerLevel[config.boxesPerLevel.length - 1];
    } else {
        currentBoxNumber = config.boxesPerLevel[currentLevel-1];
    }
    currentDeviation = config.defaultDeviation - currentLevel;
    if(currentDeviation < config.minDeviation) {
        currentDeviation = config.minDeviation;
    }
  }

  function startNewRound() {
    var color = Color.getRandomColor(),
      deviationColor = color.getDeviationColor(currentDeviation),
      boxesPerLevel = currentBoxNumber,
      deviationIndex;
    currentBoxes = [];
    for (let i = 0; i < boxesPerLevel; i++) {
      let box = {
        id: i,
        isTarget: false,
        color: color,
      };
      currentBoxes.push(box);
    }
    deviationIndex = Math.floor(Math.random() * currentBoxes.length);
    currentBoxes[deviationIndex].color = deviationColor;
    currentBoxes[deviationIndex].isTarget = true;
    newRoundStartListener({
        boxes: currentBoxes,
        level: currentLevel,
    });
  }

  that.start = start;
  that.setNewRoundStartListener = setNewRoundStartListener;
  that.checkIfBoxIsTarget = checkIfBoxIsTarget;
  return that;
};