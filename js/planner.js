/* Academic Planner — add, complete, delete tasks. Persists in localStorage
   so the list survives a page reload (this is a real site, not a chat
   artifact, so localStorage is fair game here). */

(function () {
  var STORAGE_KEY = "cos106_planner_tasks";

  /** @type {{id: string, title: string, due: string, done: boolean}[]} */
  var tasks = [];

  var form = document.getElementById("plannerForm");
  var input = document.getElementById("taskInput");
  var dateInput = document.getElementById("taskDue");
  var list = document.getElementById("taskList");
  var emptyState = document.getElementById("emptyState");
  var countTotal = document.getElementById("countTotal");
  var countDone = document.getElementById("countDone");
  var countOpen = document.getElementById("countOpen");

  function loadTasks() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : seedTasks();
    } catch (err) {
      tasks = seedTasks();
    }
  }

  function seedTasks() {
    // First-run sample data so the planner isn't a blank box on first load
    return [
      { id: makeId(), title: "Submit COS 106 term project repo link", due: "", done: false },
      { id: makeId(), title: "Review HTML semantic elements before the exam", due: "", done: true }
    ];
  }

  function saveTasks() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function makeId() {
    return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatDue(due) {
    if (!due) return "";
    var d = new Date(due + "T00:00:00");
    if (isNaN(d.getTime())) return due;
    return "Due " + d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function render() {
    list.innerHTML = "";

    if (tasks.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      tasks.forEach(function (task) {
        list.appendChild(buildTaskItem(task));
      });
    }

    var doneCount = tasks.filter(function (t) { return t.done; }).length;
    countTotal.textContent = tasks.length;
    countDone.textContent = doneCount;
    countOpen.textContent = tasks.length - doneCount;
  }

  function buildTaskItem(task) {
    var item = document.createElement("li");
    item.className = "task-item" + (task.done ? " is-done" : "");
    item.dataset.id = task.id;

    var check = document.createElement("button");
    check.className = "task-check";
    check.type = "button";
    check.setAttribute("aria-label", task.done ? "Mark task as not done" : "Mark task as done");
    check.innerHTML = task.done
      ? '<svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="#11151c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : "";
    check.addEventListener("click", function () { toggleTask(task.id); });

    var main = document.createElement("div");
    main.className = "task-main";

    var title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;
    main.appendChild(title);

    if (task.due) {
      var due = document.createElement("p");
      due.className = "task-due";
      due.textContent = formatDue(task.due);
      main.appendChild(due);
    }

    var del = document.createElement("button");
    del.className = "task-delete mono";
    del.type = "button";
    del.textContent = "Remove";
    del.setAttribute("aria-label", "Delete task: " + task.title);
    del.addEventListener("click", function () { deleteTask(task.id); });

    item.appendChild(check);
    item.appendChild(main);
    item.appendChild(del);
    return item;
  }

  function addTask(title, due) {
    tasks.unshift({ id: makeId(), title: title, due: due, done: false });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (task) {
      task.done = !task.done;
      saveTasks();
      render();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    render();
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var title = input.value.trim();
      if (!title) {
        input.focus();
        return;
      }
      addTask(title, dateInput.value);
      input.value = "";
      dateInput.value = "";
      input.focus();
    });

    loadTasks();
    render();
  }
})();
