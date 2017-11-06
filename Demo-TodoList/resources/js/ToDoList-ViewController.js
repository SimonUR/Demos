/* eslint-env browser */
/* global TodoList */

TodoList.ViewController = function(inputEl, listEl) {
  "use strict";
  const MAX_VISIBLE_TITLE_LENGTH = 20;
  var that = {},
    listeners = [];

  function notifyListeners(event, data) {
    if (listeners[event] === undefined) {
      return;
    }
    for (let i = 0; i < listeners[event].length; i++) {
      listeners[event][i](data);
    }
  }

  function onTaskElementToggled(event) {
    var taskID = event.target.parentElement.id;
    notifyListeners("taskStatusChanged", {
      taskID: taskID,
    });
  }

  function onInputChanged(event) {
    if (event.key === "Enter" && inputEl.value !== "") {
      notifyListeners("taskDescriptionEntered", { title: inputEl.value, });
    }
  }

  function trimTitle(title, cutoff) {
    if (title.length <= cutoff) {
      return title;
    }
    return title.substring(0, cutoff) + "...";
  }

  function createTaskElement(task) {
    var el,
      container = document.createElement("div"),
      checkedStatus = !task.active ? "checked" : "",
      statusClass = task.active ? "active" : "inactive";

    container.innerHTML =
      "<li id='" + task.id + "' title='" + task.body + "' class='list-item " +
      statusClass +
      "'>\
        <input class='list-item-checkbox' id='check-" + task.id +
      "' type='checkbox' " + checkedStatus + ">\
        <label for='check-" +
      task.id +
      "'><span></span></label>\
        <span class='list-item-title'>" +
      trimTitle(task.body, MAX_VISIBLE_TITLE_LENGTH) +
      "</span>\
        <span class='list-item-date'>" + task.createdAt +
      "</span>\
        </li>";
    el = container.firstChild;
    el.querySelector("input").addEventListener("change", onTaskElementToggled);
    return el;
  }

  function getTaskElement(task) {
    var el = listEl.querySelector("#" + task.id);
    return el;
  }

  function sortTaskList() {
    var tasks = listEl.querySelectorAll(".list-item"),
      activeElements = listEl.querySelectorAll(".list-item  .active"),
      lastActiveElement = activeElements[activeElements.length - 1];
    for (let i = 0; i < tasks.length; i++) {
      let el = tasks[i];
      if (el.classList.contains("inactive")) {
        listEl.insertBefore(el, lastActiveElement);
      }
    }

  }

  /**
   * Renders a new task in the list
   * @param {Object} task The single task to be renderd or an array with multiple tasks
   */
  function addTask(task) {
    var el;
    if (task instanceof Array) {
      task.forEach(addTask);
      return;
    }
    el = getTaskElement(task);
    if (el !== null) {
      return;
    }
    el = createTaskElement(task);
    listEl.insertBefore(el, listEl.firstChild);
    sortTaskList();
  }

  /**
   * Tries to update a specific task in the list with new information
   * @param  {Object} task The updated task 
   */
  function updateTask(task) {
    var el = getTaskElement(task),
      statusClass = task.active ? "active" : "inactive";
    if (el === null) {
      return;
    }
    el.classList.remove("active", "inactive");
    el.classList.add(statusClass);
    el.querySelector(".list-item-checkbox").checked = !task.active;
    el.querySelector(".list-item-title").innerHTML = trimTitle(task.body,
      MAX_VISIBLE_TITLE_LENGTH);
    el.querySelector(".list-item-date").innerHTML = task.createdAt;
    sortTaskList();
  }

  /**
   * Removes the current content from the input view
   */
  function clearInputView() {
    inputEl.value = "";
  }

  /**
   * Tries to focus the input element
   */
  function focusInputView() {
    inputEl.focus();
  }

  /**
   * Subscripes a given listener to a specific event
   * @param {String} event   The event to subscribe to
   * @param {Function} listener Callback to be subscribed to the event
   */
  function addEventListener(event, listener) {
    if (typeof listener !== "function") {
      return;
    }
    if (listeners[event] === undefined) {
      listeners[event] = [];
    }
    listeners[event].push(listener);
  }

  inputEl.addEventListener("keyup", onInputChanged);

  that.addTask = addTask;
  that.addTasks = addTask;
  that.updateTask = updateTask;
  that.clearInputView = clearInputView;
  that.focusInputView = focusInputView;
  that.addEventListener = addEventListener;
  return that;
};
