/* eslint-env browser */
/* global TodoList, MME */

TodoList.Model = function(storage, storageKey) {
  "use strict";
  var that = {},
    tasks = [];

  function seralizeToLocalStorage() {
    var serializedTasks = JSON.stringify(tasks);
    storage.setItem(storageKey, serializedTasks);
  }

  function deserializeFromLocalStorage() {
    var serializedTasks = storage.getItem(storageKey);
    if (serializedTasks) {
      tasks = JSON.parse(serializedTasks);
    } else {
      tasks = [];
    }
  }

  function copyTask(task) {
    return {
      id: task.id,
      body: task.body,
      createdAt: task.createdAt,
      active: task.active,
    };
  }

  function createNewTask(body) {
    var timestamp = new Date,
      timestring = MME.TIME.getFormattedDate(timestamp, "D/M/YYYY h:m");
    return {
      id: "task-" + timestamp.getTime(),
      body: body,
      createdAt: timestring,
      active: true,
    };
  }

  function getTaskById(taskId) {
    return tasks.filter(function(task) {
      return task.id === taskId;
    })[0];
  }

  /**
   * Creates a new entry in the tasklist
   * @param {String} body Title/Description of the new task
   * @return {Object} A copy of the new task
   */
  function addNewTask(body) {
    var task = createNewTask(body);
    tasks.push(task);
    return copyTask(task);
  }

  /**
   * Returns all tasks 
   * @return {Array} An array with copies of every task
   */
  function getTasks() {
    var result = [];
    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      result.push(copyTask(task));
    }
    return result;
  }

  /**
   * Toggles the 'active' status of the task identified by 'taskId'
   * @param {String} The ID of the task which status should be toggled
   * @return {Object} A copy of the task which status was toggled or null if 'taskId' could not be matched to a task
   */
  function toggleTaskStatus(taskId) {
    var task = getTaskById(taskId);
    if (task) {
      task.active = !task.active;
      return copyTask(task);
    }
    return null;
  }

  /**
   * Saves the current task list to storage
   */
  function save() {
    seralizeToLocalStorage();
  }

  /**
   * Loads the saved task list from storage
   */
  function load() {
    deserializeFromLocalStorage();
  }

  that.addNewTask = addNewTask;
  that.getTasks = getTasks;
  that.toggleTaskStatus = toggleTaskStatus;
  that.save = save;
  that.load = load;
  return that;
};
