/* eslint-env browser */

var EffectPlayer = EffectPlayer || {};
EffectPlayer.CanvasFilter = function(canvas) {
  "use strict";

  var that = {},
    PIXEL_VECTOR_LENGTH = 4,
    context = canvas.getContext("2d");

  function getImageData() {
    return context.getImageData(0, 0, canvas.width, canvas.height);
  }

  function getPixelAtPosition(position, data, width, height) {
    return {
      red: data[position],
      green: data[position + 1],
      blue: data[position + 2],
      alpha: data[position + 3],
      position: position,
      data: data,
      width: width,
      height: height,
    };
  }

  function drawPixels(pixels) {
    context.putImageData(pixels, 0, 0);
  }

  function filter(filterFunction) {
    var i, imageData = getImageData(),
      data = imageData.data,
      result;
    for (i = 0; i < data.length; i += PIXEL_VECTOR_LENGTH) {
      result = filterFunction(getPixelAtPosition(i, data, imageData.width, imageData.height));
      data[i] = result.red;
      data[i + 1] = result.green;
      data[i + 2] = result.blue;
      data[i + 3] = result.alpha;
    }
    drawPixels(imageData);
  }

  function apply(canvasFilter) {
    filter(canvasFilter);
  }

  that.apply = apply;
  return that;
};

EffectPlayer.GRAYSCALE = function(pixel) {
  "use strict";
  // Source for ratio: https://en.wikipedia.org/wiki/Luma_%28video%29
  var value = 0.2126 * pixel.red + 0.7152 * pixel.green + 0.0722 *
    pixel.blue;
  return {
    red: value,
    green: value,
    blue: value,
    alpha: pixel.alpha,
  };
};

EffectPlayer.BRIGHTEN = function(pixel) {
  "use strict";
  var ADJUSTMENT = 50;
  return {
    red: pixel.red + ADJUSTMENT,
    green: pixel.green + ADJUSTMENT,
    blue: pixel.blue + ADJUSTMENT,
    alpha: pixel.alpha,
  };
};

EffectPlayer.THRESHOLD = function(pixel) {
  "use strict";
  var THRESHOLD = 100,
    value = (0.2126 * pixel.red + 0.7152 * pixel.green + 0.0722 *
      pixel.blue >= THRESHOLD) ? 255 : 0;
  return {
    red: value,
    green: value,
    blue: value,
    alpha: pixel.alpha,
  };
};
