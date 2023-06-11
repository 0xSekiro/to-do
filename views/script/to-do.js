// get tasks
async function getTasks() {
  const tasksRes = await fetch(`/api/v1/tasks/`, {
    headers: { Accept: "application/json" },
    method: "GET",
  });
  const theTasks = JSON.parse(await tasksRes.text());
  console.log(theTasks.tasks);
  theTasks.tasks.forEach((el) => {
    if (el.isDone == false) {
      createTask(el.name, "add");
    } else {
      createTask(el.name, "done");
    }
  });
}
window.onload = getTasks();

// add tasks
const taskBtn = document.querySelector("#addTask");
taskBtn.onclick = async () => {
  let val = document.querySelector("input").value;
  val = val.replace(/[^a-zA-Z0-9\s]/g, "");
  if (!val) {
    return (document.querySelector("p").innerText = "Please enter task name");
  }
  const res = await fetch("/api/v1/tasks", {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ name: val }),
  });
  createTask(val, "add");
};

function createTask(val, mess) {
  const task = document.createElement("div");
  task.className = "task";
  const span = document.createElement("span");
  span.innerText = val;

  // done button and its functionality
  const doneBtn = document.createElement("button");
  if (mess == "add") {
    doneBtn.innerText = "Done";
    doneBtn.addEventListener("click", () => taskIsDone(val));
  } else {
    doneBtn.innerText = "Un done";
    span.style = "  text-decoration: line-through;";
    doneBtn.addEventListener("click", () => unDoneTask(val));
  }
  doneBtn.id = "done";

  // delete button and its functionality
  const delBtn = document.createElement("button");
  delBtn.innerText = "Delete Task";
  delBtn.id = "del";
  delBtn.addEventListener("click", () => delTask(val));

  task.appendChild(span);
  task.appendChild(doneBtn);
  task.appendChild(delBtn);
  task.id = val;

  if (mess == "add") {
    document.getElementById("container").appendChild(task);
  } else {
    document.getElementById("doneTasks").appendChild(task);
    doneBtn.parentElement.style = "opacity: .5;";
  }
}

// delete task funciton

async function delTask(val) {
  const res = await fetch(`/api/v1/tasks/`, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "DELETE",
    body: JSON.stringify({ name: val }),
  });
  if (res.status == 204) {
    const el = document.getElementById(val);
    el.parentElement.removeChild(el);
  }
}

// taskIsDone function
async function taskIsDone(val) {
  createTask(val, "done");
  Array.from(document.getElementById("container").children).forEach((el) => {
    if (el.id == val) {
      el.parentElement.removeChild(el);
    }
  });

  const res = await fetch("/api/v1/tasks", {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "PATCH",
    body: JSON.stringify({ name: val, isDone: true }),
  });
}

// task is not done function

async function unDoneTask(val) {
  createTask(val, "add");
  Array.from(document.getElementById("doneTasks").children).forEach((el) => {
    if (el.id == val) {
      el.parentElement.removeChild(el);
    }
  });
  const res = await fetch("/api/v1/tasks", {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "PATCH",
    body: JSON.stringify({ name: val, isDone: false }),
  });
}
