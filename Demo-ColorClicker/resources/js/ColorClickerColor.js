/* eslint-env browser */
/* global ColorClicker */

var ColorClicker = ColorClicker || {};

(function(context) {
  "use strict";

  function Color(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  Color.prototype.getDeviationColor = function(deviation) {
    var r = this.red - deviation,
      g = this.green - deviation,
      b = this.blue - deviation;
    return new Color(r, g, b);
  };

  Color.prototype.toCSS = function() {
    let colors = [this.red, this.green, this.blue];
    return "rgb(" + colors.join(",") + ")";
  };

  Color.getRandomColor = function() {
    var r = Math.floor((Math.random() * 255) + 1),
      g = Math.floor((Math.random() * 255) + 1),
      b = Math.floor((Math.random() * 255) + 1);
    r = Math.floor((r + 255) / 2);
    g = Math.floor((g + 255) / 2);
    b = Math.floor((b + 255) / 2);
    return new Color(r, g, b);
  };

  context.Color = Color;
}(ColorClicker));