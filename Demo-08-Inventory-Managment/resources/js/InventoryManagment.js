/* eslint-env browser */
/* global request */

var InventoryManagment = (function() {
  "use strict";
  var that = {},
    shopInventory,
    customerInventory,
    shopView,
    customerView;

  function onItemSold(event) {
    var sellerView = event.data.seller === shopInventory.id() ? shopView :
      customerView;
    sellerView.removeItem(event.data.item);
    sellerView.setFunds(event.data.funds);
  }

  function onItemBought(event) {
    var buyerView = event.data.buyer === shopInventory.id() ? shopView :
      customerView;
    buyerView.addItem(event.data.item);
    buyerView.setFunds(event.data.funds);
  }

  function onItemDropped(event) {
    var source, target, item;
    source = event.data.source === shopInventory.id() ? shopInventory :
      customerInventory;
    target = event.data.target === shopInventory.id() ? shopInventory :
      customerInventory;
    item = source.getItemById(event.data.item);
    source.sellItem(item);
    target.buyItem(item);
  }

  function init() {
    request({
      url: "resources/data/data.json",
      success: onDataLoaded,
    });
  }

  function onDataLoaded(result) {
    var data = JSON.parse(result);
    initInventories(data);
    initViews();
  }

  function initInventories(data) {
    shopInventory = new InventoryManagment.Inventory(data.shopOwner);
    shopInventory.addEventListener("itemSold", onItemSold);
    shopInventory.addEventListener("itemBought", onItemBought);
    data.items.shop.forEach(shopInventory.addItem);
    customerInventory = new InventoryManagment.Inventory(data.customer);
    customerInventory.addEventListener("itemSold", onItemSold);
    customerInventory.addEventListener("itemBought", onItemBought);
    data.items.customer.forEach(customerInventory.addItem);
  }

  function initViews() {
    var shopViewEl = document.querySelector(".inventory.shop"),
      customerViewEl = document.querySelector(".inventory.customer");
    shopView = new InventoryManagment.InventoryView(shopViewEl);
    shopView.setId(shopInventory.id());
    shopView.setFunds(shopInventory.funds());
    shopInventory.items().forEach(shopView.addItem);
    shopView.addEventListener("itemDropped", onItemDropped);
    customerView = new InventoryManagment.InventoryView(customerViewEl);
    customerView.setId(customerInventory.id());
    customerView.setFunds(customerInventory.funds());
    customerInventory.items().forEach(customerView.addItem);
    customerView.addEventListener("itemDropped", onItemDropped);
  }

  that.init = init;
  return that;
}());
