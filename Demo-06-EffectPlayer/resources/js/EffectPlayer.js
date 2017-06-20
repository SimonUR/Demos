/* eslint-env browser */
/* global MMEDropZone */

var EffectPlayer = EffectPlayer || (function() {
  "use strict";

  var that = {},
    videoDropTarget,
    player,
    videoControls,
    canvas,
    filterControls;

  function onMovieFileDropped(event) {
    player.setFile(event.data);
    videoDropTarget.hide();
  }

  function onVideoFrameAvailable(event) {
    canvas.drawVideoFrame(event.data);
  }

  function onVideoPlaybackStatusChanged(event) {
    var newStatus = event.data;
    switch (newStatus) {
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
    var newMode = event.data;
    switch (newMode) {
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

  function onPlayerButtonClicked(event) {
    var clickedButton = event.data;
    switch (clickedButton) {
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

  function onFilterButtonClicked(event) {
    var filter = event.data,
      filters = ["grayscale", "threshold", "brighten", ];
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

  function init() {
    var videoContainer = document.querySelector(".video-container"),
      canvasContainer = document.querySelector(".canvas-container"),
      dropIndicator = document.querySelector(".drag-and-drop-hint"),
      videoElement = videoContainer.querySelector("video");
    initDragAndDrop(dropIndicator);
    initPlayer(videoElement);
    initPlayerControls(videoContainer);
    initFilterControls(canvasContainer);
    initCanvas(canvasContainer);
  }

  function initDragAndDrop(dropIndicator) {
    videoDropTarget = new MMEDropZone(dropIndicator, ["video/mp4", ]);
    videoDropTarget.addEventListener("fileDropped", onMovieFileDropped);
  }

  function initPlayerControls(videoContainer) {
    videoControls = new EffectPlayer.VideoControls({
      play: videoContainer.querySelector(".icon-play"),
      pause: videoContainer.querySelector(".icon-pause"),
      stop: videoContainer.querySelector(".icon-stop"),
      loop: videoContainer.querySelector(".icon-loop"),
    });
    videoControls.addEventListener("buttonPressed", onPlayerButtonClicked);
  }

  function initPlayer(videoElement) {
    player = new EffectPlayer.VideoPlayer(videoElement);
    player.addEventListener("videoFrameAvailable", onVideoFrameAvailable);
    player.addEventListener("playbackStatusChanged",
      onVideoPlaybackStatusChanged);
    player.addEventListener("videoLoopModeChanged", onVideoLoopModeChanged);
  }

  function initFilterControls(canvasContainer) {
    filterControls = new EffectPlayer.FilterControls({
      grayscale: canvasContainer.querySelector(".icon-filter-grayscale"),
      brighten: canvasContainer.querySelector(".icon-filter-brighten"),
      threshold: canvasContainer.querySelector(".icon-filter-threshold"),
    });
    filterControls.addEventListener("buttonPressed", onFilterButtonClicked);
  }

  function initCanvas(canvasContainer) {
    var canvasElement = canvasContainer.querySelector("canvas");
    canvas = new EffectPlayer.VideoCanvas(canvasElement);
  }

  that.init = init;
  return that;
}());
