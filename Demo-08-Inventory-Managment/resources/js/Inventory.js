/* eslint-env browser */
/* global MMEventTarget */

var InventoryManagment = InventoryManagment || {};
InventoryManagment.Inventory = function(owner) {
  "use strict";
  var that = new MMEventTarget(),
    items = [];

  function getFunds() {
    return owner.funds;
  }

  function getId() {
    return owner.id;
  }

  function getItems() {
    return items;
  }

  function getItemById(id) {
    var item = items.find(checkItemId.bind(this, id));
    return item;
  }

  function checkItemId(value, item) {
    return item.id === value;
  }

  function addItem(item) {
    items.push(item);
  }

  function removeItem(item) {
    var itemIndex = items.indexOf(item);
    items.splice(itemIndex, 1);
  }

  function buyItem(item) {
    addItem(item);
    owner.funds -= item.value;
    that.dispatchEvent({
      type: "itemBought",
      data: {
        buyer: owner.id,
        item: item,
        funds: owner.funds,
      },
    });
  }

  function sellItem(item) {
    removeItem(item);
    owner.funds += item.value;
    that.dispatchEvent({
      type: "itemSold",
      data: {
        seller: owner.id,
        item: item,
        funds: owner.funds,
      },
    });
  }

  that.funds = getFunds;
  that.id = getId;
  that.items = getItems;
  that.getItemById = getItemById;
  that.addItem = addItem;
  that.removeItem = removeItem;
  that.buyItem = buyItem;
  that.sellItem = sellItem;
  return that;
};
