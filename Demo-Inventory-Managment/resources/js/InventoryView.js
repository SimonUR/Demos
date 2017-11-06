/* eslint-env browser */
/* global MMEventTarget */

var InventoryManagment = InventoryManagment || {};
InventoryManagment.InventoryView = function(el) {
  "use strict";
  var that = new MMEventTarget(),
    itemList = el.querySelector(".content"),
    ownerId = el.querySelector("h1"),
    currentFunds = el.querySelector(".funds");

  function onDragStart(event) {
    var data = {
      source: ownerId.innerHTML,
      item: event.target.getAttribute("data-id"),
    };
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
  }

  function onDragEnter() {
    itemList.classList.add("highlighted");
  }

  function onDragOver(event) {
    event.preventDefault();
  }

  function onDragLeave() {
    itemList.classList.remove("highlighted");
  }

  function onDrop(event) {
    var data = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (data.source !== ownerId.innerHTML) {
      data.target = ownerId.innerHTML;
      that.dispatchEvent({
        type: "itemDropped",
        data: data,
      });
    }
  }

  function createItemEl(item) {
    var el = document.createElement("div");
    el.innerHTML = "<li class='item " + item.id +
      "' draggable='true' data-id='" + item.id + "'></li>";
    return el.firstChild;
  }

  function selectItemEl(item) {
    var selector = "[data-id=" + item.id + "]";
    return itemList.querySelector(selector);
  }

  function addItem(item) {
    var el = selectItemEl(item);
    if (el) {
      return;
    }
    el = createItemEl(item);
    el.addEventListener("dragstart", onDragStart);
    itemList.append(el);
  }

  function removeItem(item) {
    var el = selectItemEl(item);
    if (el) {
      itemList.removeChild(el);
    }
  }

  function setFunds(funds) {
    currentFunds.innerHTML = funds;
  }

  function setId(id) {
    ownerId.innerHTML = id;
  }

  function init() {
    itemList.addEventListener("dragenter", onDragEnter);
    itemList.addEventListener("dragover", onDragOver);
    itemList.addEventListener("dragleave", onDragLeave);
    itemList.addEventListener("drop", onDrop);
    return that;
  }

  that.addItem = addItem;
  that.removeItem = removeItem;
  that.setFunds = setFunds;
  that.setId = setId;
  return init();
};
