const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue = "";


const getTodosLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("todos")) || [];
  } catch {
    return [];
  }
};

const setTodosLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  setTodosLocalStorage(todos);
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();
  const filtered = todos.filter((t) => t.text !== todoText);
  setTodosLocalStorage(filtered);
};

const toggleDoneLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();
  const idx = todos.findIndex((t) => t.text === todoText);
  if (idx > -1) {
    todos[idx].done = !todos[idx].done;
    setTodosLocalStorage(todos);
  }
};

const updateTodoLocalStorage = (oldText, newText) => {
  const todos = getTodosLocalStorage();
  const idx = todos.findIndex((t) => t.text === oldText);
  if (idx > -1) {
    todos[idx].text = newText;
    setTodosLocalStorage(todos);
  }
};


const saveTodo = (text, done = false, save = true) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");
  if (done) todo.classList.add("done");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.setAttribute("type", "button");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.setAttribute("type", "button");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.setAttribute("type", "button");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  if (save) {
    saveTodoLocalStorage({ text, done });
  }

  todoList.appendChild(todo);
  todoInput.value = "";
  todoInput.focus();
};


const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};


const updateTodoTextInDOM = (oldText, newText) => {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    const h3 = todo.querySelector("h3");
    if (h3 && h3.innerText === oldText) {
      h3.innerText = newText;
    }
  });
};


const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");
  const normalizedSearch = search.toLowerCase();
  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    todo.style.display = todoTitle.includes(normalizedSearch) ? "flex" : "none";
  });
};


const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");
  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;
    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none")
      );
      break;
    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none")
      );
      break;
    default:
      break;
  }
};


todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = todoInput.value.trim();
  if (inputValue) {
    saveTodo(inputValue, false, true);
  }
});


document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const button = targetEl.closest("button");
  const todoEl = targetEl.closest(".todo");
  let todoTitle = "";

  if (todoEl && todoEl.querySelector("h3")) {
    todoTitle = todoEl.querySelector("h3").innerText;
  }

  if (button && button.classList.contains("finish-todo")) {
    if (!todoEl) return;
    todoEl.classList.toggle("done");
    toggleDoneLocalStorage(todoTitle);
    return;
  }

  if (button && button.classList.contains("remove-todo")) {
    if (!todoEl) return;
    todoEl.remove();
    removeTodoLocalStorage(todoTitle);
    return;
  }

  if (button && button.classList.contains("edit-todo")) {
    if (!todoEl) return;
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
    return;
  }
});


cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});


editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value.trim();
  if (!editInputValue) {
    toggleForms();
    return;
  }


  updateTodoTextInDOM(oldInputValue, editInputValue);
  updateTodoLocalStorage(oldInputValue, editInputValue);

  toggleForms();
});


searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearchTodos(search);
});


eraseBtn.addEventListener("click", (e) => {

  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});


filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
});


const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    const doneBool = !!todo.done;
    saveTodo(todo.text, doneBool, false);
  });
};


loadTodos();