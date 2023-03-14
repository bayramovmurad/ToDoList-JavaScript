"use strict"

let gorevListesi = [];

if(localStorage.getItem("gorevListesi") !== null){
    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

let editId;
let isEditTask = false;

const nextTask = document.getElementById("textTaskName")
const btnClear = document.getElementById("btnClear")
const filters = document.querySelectorAll(".filters span")

displayTask("all");

function displayTask(filter) {
    let ul = document.getElementById("task-list");

    ul.innerHTML = "";
    if (gorevListesi.length == '') {
        ul.innerHTML = "<p class='p-3 m-0'>Gorev listeniz bos</p>"
    }

    for (let gorev of gorevListesi) {

        let completed = gorev.durum == "completed" ? "checked" : "";

        if (filter == gorev.durum || filter == "all") {
            let li = `

<li class="task border-bottom border-secondary bg-black text-white list-group-item">
<div class="form-check">
 <input type="checkbox" onclick="uptadeStatus(this)" id="${gorev.id}" class="form-check-input " ${completed}>
 <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.GorevAdi}</label>

</div>
<div class="dropdown">
<button class="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
</button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
       <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="bi bi-trash"></i> Sil</a></li>
       <li><a onclick='editTask(${gorev.id}, "${gorev.GorevAdi}")' class="dropdown-item" href="#"><i class="bi bi-pencil"></i> Duzenle</a></li>
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


function newTask(e) {

    if (nextTask.value == "") {
        alert("Lutfen bir gorev giriniz.")
    } else {
        if (!isEditTask) {
            gorevListesi.push({ "id": gorevListesi.length + 1, "GorevAdi": nextTask.value, "durum": "pending" });
        } else {
            for (let gorev of gorevListesi) {
                if (gorev.id == editId) {
                    gorev.GorevAdi = nextTask.value;
                }
                isEditTask = false;
            }
        }


        nextTask.value = '';
        displayTask(document.querySelector('span.active').id);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    }



    e.preventDefault()
}


function deleteTask(id) {
    let deleteId;
    for (let index in gorevListesi) {
        if (gorevListesi[index].id == id) {
            deleteId = index;
        }

    }
    gorevListesi.splice(deleteId, 1);
    displayTask(document.querySelector('span.active').id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    nextTask.value = taskName;
    nextTask.focus();
    nextTask.classList.add("active")
}

btnClear.addEventListener('click', function () {
    gorevListesi.splice(0, gorevListesi.length)
    localStorage.clear(gorevListesi)
    displayTask()

})

for (let span of filters) {
    span.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active")
        span.classList.add("active")
        displayTask(span.id)

    })
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}


function uptadeStatus(selectedTask) {
    let label = selectedTask.nextElementSibling;
    let durum;
    if (selectedTask.checked) {
        label.classList.add("checked")
        durum = "completed";
    } else {
        label.classList.remove("checked")
        durum = "pending";
    }

    for (let gorev of gorevListesi) {
        if (gorev.id == selectedTask.id) {
            gorev.durum = durum;
        }
    }

    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    displayTask(document.querySelector('span.active').id);
}