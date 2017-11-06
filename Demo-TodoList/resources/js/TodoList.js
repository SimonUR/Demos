/* eslint-env browser */

var TodoList = (function() {
  "use strict";

  const STORAGE_KEY = "mme-todolist";

  var that = {},
    model,
    view;

  function onTaskDescriptionEntered(event) {
    var newTask = model.addNewTask(event.title);
    view.addTask(newTask);
    view.clearInputView();
    view.focusInputView();
    model.save();
  }

  function onTaskStatusChanged(event) {
    var updatedTask = model.toggleTaskStatus(event.taskID);
    view.updateTask(updatedTask);
    model.save();
  }

  function init() {
    initModel();
    initView();
  }

  function initModel() {
    model = new TodoList.Model(localStorage, STORAGE_KEY);
    model.load();
  }

  function initView() {
    var inputElement = document.querySelector(".add-new-item-input"),
      listElement = document.querySelector(".all-items-list"),
      currentTasks = model.getTasks();
    view = new TodoList.ViewController(inputElement, listElement);
    view.addEventListener("taskDescriptionEntered",
      onTaskDescriptionEntered);
    view.addEventListener("taskStatusChanged", onTaskStatusChanged);
    view.addTasks(currentTasks);
  }

  that.init = init;
  return that;
}());
