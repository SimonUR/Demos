/* eslint-env browser */
/* global DropTarget */

var EffectPlayer = EffectPlayer || (function() {
  "use strict";

  var that = {},
    dropIndicator,
    dropTarget,
    player,
    videoControls,
    canvas,
    filterControls;

  function onMovieFileDropped(event) {
    player.setFile(event.data);
    dropIndicator.classList.add("hidden");
  }

  function onVideoButtonPressed(type) {
    switch (type) {
      case "play":
        player.play();
        break;
      case "pause":
        player.pause();
        break;
      case "stop":
        player.stop();
        break;
      case "loop":
        player.toogleLoopMode();
        break;
      default:
        break;
    }
  }

  function onFilterButtonClicked(filter) {
    var filters = ["grayscale", "threshold", "brighten", ];
    filters.splice(filters.indexOf(filter), 1);
    filterControls.toggleButtonState(filter);
    filterControls.clearButtonState(filters[0]);
    filterControls.clearButtonState(filters[1]);
    if (filterControls.getButtonState(filter)) {
      canvas.setFilter(filter);
    } else {
      canvas.clearFilter();
    }
  }

  function onVideoFrameAvailable(event) {
    canvas.drawVideoFrame(event.data);
  }

  function onVideoPlaybackStatusChanged(status) {
    switch (status) {
      case "play":
        videoControls.setButtonState("play");
        videoControls.clearButtonState("stop");
        videoControls.clearButtonState("pause");
        break;
      case "pause":
        videoControls.setButtonState("pause");
        videoControls.clearButtonState("play");
        videoControls.clearButtonState("stop");
        break;
      case "stop":
        videoControls.setButtonState("stop");
        videoControls.clearButtonState("play");
        videoControls.clearButtonState("pause");
        break;
      default:
        break;
    }
  }

  function onVideoLoopModeChanged(event) {
    switch (event.data) {
      case "loop":
        videoControls.setButtonState("loop");
        break;
      case "no-loop":
        videoControls.clearButtonState("loop");
        break;
      default:
        break;
    }
  }

  function init() {
    var videoContainer = document.querySelector(".video-container"),
      canvasContainer = document.querySelector(
        ".canvas-container");
    initDragAndDrop(videoContainer);
    initPlayerControls(videoContainer);
    initPlayer(videoContainer);
    initCanvas(canvasContainer);
    initFilterControls(canvasContainer);
  }

  function initDragAndDrop(videoContainer) {
    dropIndicator = document.querySelector(".drag-and-drop-hint");
    dropTarget = new DropTarget({
      target: videoContainer,
      hoverClass: "highlight-drop",
    });
    dropTarget.addEventListener("moviedropped", onMovieFileDropped);
  }

  function initPlayerControls(videoContainer) {
    videoControls = new EffectPlayer.VideoControls({
      play: videoContainer.querySelector(".icon-play"),
      pause: videoContainer.querySelector(".icon-pause"),
      stop: videoContainer.querySelector(".icon-stop"),
      loop: videoContainer.querySelector(".icon-loop"),
    });
    videoControls.addEventListener("playButtonPressed",
      onVideoButtonPressed.bind(
        null, "play"));
    videoControls.addEventListener("pauseButtonPressed",
      onVideoButtonPressed
      .bind(
        null, "pause"));
    videoControls.addEventListener("stopButtonPressed",
      onVideoButtonPressed.bind(
        null, "stop"));
    videoControls.addEventListener("loopButtonPressed",
      onVideoButtonPressed.bind(
        null, "loop"));
  }

  function initPlayer(videoContainer) {
    player = new EffectPlayer.VideoPlayer({
      target: videoContainer.querySelector("video"),
    });
    player.addEventListener("videoFrameAvailable",
      onVideoFrameAvailable);
    player.addEventListener("videoPlayed",
      onVideoPlaybackStatusChanged.bind(
        null, "play"));
    player.addEventListener("videoPaused",
      onVideoPlaybackStatusChanged.bind(
        null, "pause"));
    player.addEventListener("videoStopped",
      onVideoPlaybackStatusChanged.bind(
        null, "stop"));
    player.addEventListener("videoLoopModeChanged",
      onVideoLoopModeChanged);
    player.setLoopMode("no-loop");
  }

  function initCanvas(canvasContainer) {
    canvas = new EffectPlayer.VideoCanvas({
      target: canvasContainer.querySelector("canvas"),
    });
  }

  function initFilterControls(canvasContainer) {
    filterControls = new EffectPlayer.FilterControls({
      grayscale: canvasContainer.querySelector(".icon-filter-grayscale"),
      brighten: canvasContainer.querySelector(".icon-filter-brighten"),
      threshold: canvasContainer.querySelector(".icon-filter-threshold"),
    });
    filterControls.addEventListener("grayscaleButtonPressed",
      onFilterButtonClicked.bind(
        null, "grayscale"));
    filterControls.addEventListener("thresholdButtonPressed",
      onFilterButtonClicked.bind(
        null, "threshold"));
    filterControls.addEventListener("brightenButtonPressed",
      onFilterButtonClicked.bind(
        null, "brighten"));
  }

  that.init = init;
  return that;
}());
