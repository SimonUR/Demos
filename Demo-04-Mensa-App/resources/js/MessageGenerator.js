/* eslint-env browser */
/* global request */

var MensaApp = MensaApp || {};
MensaApp.MessageGenerator = (function() {
  "use strict";

  const MESSAGE_TEMPLATE =
    "Heute gibt es in der Uni Mensa {{MAIN_DISHES}}. Dazu empfiehlt der Küchenchef {{SIDE_DISHES}}. Wie wäre es danach mit {{DESSERTS}}?",
    MAIN_DISH_TEMPLATE = "<span class='main-dish'>{{name}}</span>",
    SIDE_DISH_TEMPLATE = "<span class='side-dish'>{{name}}</span>",
    DESSERT_TEMPLATE = "<span class='dessert'>{{name}}</span>",
    JOIN_STRING = ", ",
    LAST_ELEMENT_JOIN_STRING = " und ",
    MAIN_DISH_PREFIX = "HG",
    SIDE_DISH_PREFIX = "B",
    DESSERT_PREFIX = "N";
  var that = {};

  function compileTemplateToString(template, name) {
    return template.replace("{{name}}", name);

  }

  function concatDishStrings(dishes) {
    var tmp = dishes.splice(dishes.length - 1),
      result = dishes.join(JOIN_STRING);
    return result + LAST_ELEMENT_JOIN_STRING + tmp;
  }

  function createMenuMessage(menu) {
    var mainDishes = [],
      sideDishes = [],
      desserts = [],
      message = MESSAGE_TEMPLATE;
    for (let i = 0; i < menu.length; i++) {
      let entry = menu[i],
        target,
        template;
      if (entry.category.startsWith(MAIN_DISH_PREFIX)) {
        target = mainDishes;
        template = MAIN_DISH_TEMPLATE;
      }
      if (entry.category.startsWith(SIDE_DISH_PREFIX)) {
        target = sideDishes;
        template = SIDE_DISH_TEMPLATE;
      }
      if (entry.category.startsWith(DESSERT_PREFIX)) {
        target = desserts;
        template = DESSERT_TEMPLATE;
      }
      if (target) {
        target.push(compileTemplateToString(template, entry.name));
      }
    }
    message = message.replace("{{MAIN_DISHES}}", concatDishStrings(
      mainDishes));
    message = message.replace("{{SIDE_DISHES}}", concatDishStrings(
      sideDishes));
    message = message.replace("{{DESSERTS}}", concatDishStrings(desserts));
    return message;
  }

  that.createMenuMessage = createMenuMessage;
  return that;
}());
