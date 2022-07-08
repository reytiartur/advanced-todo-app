const LOCAL_STORAGE_LISTS = "todo.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID = "todo.selectedListID"
const LOCAL_STORAGE_TASKS = "todo.tasks"

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS)) || [];
let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS)) || [];
let selectedListID = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);



let listsContainer = document.querySelector("[data-lists]");
let newListForm = document.querySelector("[data-new-list-form]");
let newListInput = document.querySelector("[data-new-list-input]");

let newTaskForm = document.querySelector("[data-new-task-form]");
let newTaskInput = document.querySelector("[data-new-task-input]");
let tasksContainer = document.querySelector("[data-tasks]");
let listName = document.querySelector("[data-list-name]");
let listTasksCount = document.querySelector("[data-list-count]");
let taskTemplate = document.querySelector("task-template");

let deleteBtn = document.querySelectorAll("delete-btn");


listsContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "li" && e.target.tagName.toLowerCase() !== "button") {
        selectedListID = e.target.dataset.listId;
        saveAndRender();
    }
})

listsContainer.addEventListener("click", e => {
    if(e.target.className === "delete-btn") {
        deleteElement(e);
    }
})

tasksContainer.addEventListener("click", e => {
    if(e.target.className === "delete-btn") {
        deleteElement(e);
    }
})

newListForm.addEventListener("submit", e => {
    e.preventDefault();
    let listName = newListInput.value;
    if(listName !== null || listName !== "") {
        let newList = createList(listName);
        newListInput.value = null;
        lists.push(newList);
        saveAndRender()
    }
})

// newTaskForm.addEventListener("submit", e => {
//     e.preventDefault();
//     let taskName = newTaskInput.value;
//     if(taskName !== null || taskName !== "") {
//         let newTask = createTask(taskName);
//         newTaskInput.value = null;
//         tasks.push(newTask);
//         saveAndRender();
//     }
// })

function createList(name) {
    return { id: Date.now().toString(),
            name: name,
            tasks: []
            }
}

// function createTask(name) {
//     return { id: id,
//             name: name,
//             checked: false
//             }
// }

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LISTS, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID, selectedListID)
    localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(tasks))
}

function render() {
    const selectedList = lists.find(list => list.id === selectedListID);

    clear(listsContainer);
    renderLists();
    showListName(selectedList);
    showTasksCount(selectedList);
    clear(tasksContainer)
    renderTasks(selectedList);
}

function showListName(selectedList) {  
    listName.innerText = selectedList.name;
}

function showTasksCount(selectedList) {
    if (selectedList.tasks == undefined || selectedList.tasks.length == 0) {
        console.log(selectedList.tasks)
        listTasksCount.innerText = `0 tasks remaining`;
    } else {
    const activeTasks = selectedList.tasks.filter(task => !task.done).length;
    const taskString = activeTasks === 1 ? "task" : "tasks";
    listTasksCount.innerText = `${activeTasks} ${taskString} remaining`;
    }
}

function renderLists() {
    lists.forEach(item => {
        const list = document.createElement("li");
        list.classList.add("list");
        list.dataset.listId = item.id;
        list.innerText = item.name;
        if(list.dataset.listId === selectedListID) {
            list.classList.add("active-list");

            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.innerHTML = "x";
            deleteBtn.style.marginLeft = "1rem";
            list.append(deleteBtn);
        }
        listsContainer.append(list);
    })
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        let taskInner = document.importNode(taskTemplate.content, true);
        let checkbox = taskInner.querySelector("input");
        let label = taskInner.querySelector("label");

        checkbox.id = task.id;
        checkbox.checked = task.done;
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskInner);
    })
}

function clear(element) {
    element.innerHTML = "";
}

function deleteElement(e) {
    if(e.target.closest("li").classList.contains("list")) {
        lists = lists.filter(list => list.id !== selectedListID)
        // Show Previous or Next List on Delete
        if(selectedListID.previousElementSibling) {
            selectedListID = selectedListID.previousElementSibling;
        } else if (selectedListID.nextElementSibling) {
            selectedListID = selectedListID.nextElementSibling;
        }
    } else if(e.target.closest("div").classList.contains("task")) {
        tasks = task.filter(task => task.remove())
    }
    saveAndRender();
}

render();