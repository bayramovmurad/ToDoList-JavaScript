"use strict"

let taskList = [];

if(localStorage.getItem("taskList") !== null){
    taskList = JSON.parse(localStorage.getItem("taskList"));
}

let editId;
let isEditTask = false;

const nextTask = document.getElementById("textTaskName")
const btnClear = document.getElementById("btnClear")
const filters = document.querySelectorAll(".filters span")

displayTask("all");

// Task screen

function displayTask(filter) {
    // action to be taken if there is no task
    let ul = document.getElementById("task-list");
    ul.innerHTML = "";
    if (taskList.length == '') {
        ul.innerHTML = "<p class='p-3 m-0'>Task list is empty...</p>"
    }
    
    for (let task of taskList) {
        // status action
        let completed = task.status == "completed" ? "checked" : "";


        if (filter == task.status || filter == "all") {
            let li = `

<li class="task border-bottom border-secondary bg-black text-white list-group-item">
<div class="form-check">
 <input type="checkbox" onclick="uptadeStatus(this)" id="${task.id}" class="form-check-input" ${completed}>
 <label for="${task.id}" class="form-check-label ${completed}">${task.taskName}</label>
</div>
<div class="dropdown">
<button class="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
</button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
       <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"><i class="bi bi-trash"></i></a></li>
       <li><a onclick='editTask(${task.id}, "${task.taskName}")' class="dropdown-item" href="#"><i class="bi bi-pencil"></i></a></li>
 </ul>
</div>
</li>



`;

            ul.insertAdjacentHTML("beforeend", li)
        }



    }

}


document.getElementById('btnAddNewTask').addEventListener("click", newTask)
document.getElementById('btnAddNewTask').addEventListener("keypress", () => {
    if (event.key === "Enter") {
        document.getElementById("btnAddNewTask").click();
    }

})


// Function to create a new task
function newTask(e) {

    if (nextTask.value == "") {
        alert("Please enter a task.")
    } else {
        if (!isEditTask) {
            taskList.push({ "id": taskList.length + 1, "taskName": nextTask.value, "status": "pending" });
        } else {
            for (let task of taskList) {
                if (task.id == editId) {
                    task.taskName = nextTask.value;
                }
                isEditTask = false;
            }
        }


        nextTask.value = '';
        displayTask(document.querySelector('span.active').id);
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }



    e.preventDefault()
}

// function to delete a task

function deleteTask(id) {
    let deleteId;
    for (let index in taskList) {
        if (taskList[index].id == id) {
            deleteId = index;
        }

    }
    taskList.splice(deleteId, 1);
    displayTask(document.querySelector('span.active').id);
    localStorage.setItem("taskList", JSON.stringify(taskList));
}

// function to edit a task

function editTask(taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    nextTask.value = taskName;
    nextTask.focus();
    nextTask.classList.add("active")
}

// method to delete all tasks

btnClear.addEventListener('click', function () {
    taskList.splice(0, taskList.length)
    localStorage.clear(taskList)
    displayTask()

})

// information about the current situation

for (let span of filters) {
    span.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active")
        span.classList.add("active")
        displayTask(span.id)

    })
    localStorage.setItem("taskList", JSON.stringify(taskList));
}

// activating the checkbox of tasks

function uptadeStatus(selectedTask) {
    let label = selectedTask.nextElementSibling;
    let status;
    if (selectedTask.checked) {
        label.classList.add("checked")
        status = "completed";
    } else {
        label.classList.remove("checked")
        status = "pending";
    }

    for (let task of taskList) {
        if (task.id == selectedTask.id) {
            task.status = status;
        }
    }
    console.log(taskList);
    displayTask(document.querySelector('span.active').id);
    localStorage.setItem("taskList", JSON.stringify(taskList));
   
}


