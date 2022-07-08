const LOCAL_STORAGE_LISTS = "task.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID = "task.selectedListID"
const LOCAL_STORAGE_TASKS = "task.tasks"

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS)) || [];
let selectedListID = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);



let listsContainer = document.querySelector("[data-lists]");
let newListForm = document.querySelector("[data-new-list-form]");
let newListInput = document.querySelector("[data-new-list-input]");

let newTaskForm = document.querySelector("[data-new-task-form]");
let newTaskInput = document.querySelector("[data-new-task-input]");
let tasksContainer = document.querySelector("[data-tasks]");
let listName = document.querySelector("[data-list-name]");
let listTasksCount = document.querySelector("[data-list-count]");

let deleteBtn = document.querySelectorAll("delete-btn");


listsContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "li" && e.target.tagName.toLowerCase() !== "button") {
        selectedListID = e.target.dataset.listId;
        saveAndRender();
    }
})

listsContainer.addEventListener("click", e => {
    if(e.target.className === "delete-btn") {
        deleteList(e);
    }
})

tasksContainer.addEventListener("click", e => {
    if(e.target.className === "delete-btn") {
        deleteTask(e);
    }
})

tasksContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "input") {
        const selectedList = lists.find(list => list.id === selectedListID);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.done = e.target.checked;
        save();
        showTasksCount(selectedList);
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

newTaskForm.addEventListener("submit", e => {
    e.preventDefault();
    let taskName = newTaskInput.value;
    if(taskName !== null || taskName !== "") {
        let newTask = createTask(taskName);
        newTaskInput.value = null;
        let selectedList = lists.find(list => list.id == selectedListID);
        selectedList.tasks.push(newTask);
        saveAndRender();
    }
})

function createList(name) {
    return { id: Date.now().toString(),
            name: name,
            tasks: []
            }
}

function createTask(name) {
    return { id: Date.now().toString(),
            name: name,
            done: false
            }
}

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LISTS, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID, selectedListID)
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
        list.tasks = item.tasks;
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
        let taskInner = document.createElement("div");
        taskInner.innerHTML = `
            <input type="checkbox" id="${task.id}">
            <label for="${task.id}"><span class="custom-checkbox"></span>${task.name}<button class="delete-btn">x</button></label>    
        `;
        taskInner.classList.add("task");

        let deleteBtn = taskInner.querySelector(".delete-btn");
        deleteBtn.id = task.id;
        
        let checkbox = taskInner.querySelector("input[type=checkbox]");
        checkbox.id = task.id;
        checkbox.checked = task.done;
        tasksContainer.appendChild(taskInner);
    })
}

function clear(element) {
    element.innerHTML = "";
}

function deleteList(e) {
    if(e.target.closest("li").classList.contains("list")) {
        lists = lists.filter(list => list.id !== selectedListID)
        // Show Previous or Next List on Delete
        if(selectedListID.previousElementSibling) {
            selectedListID = selectedListID.previousElementSibling;
        } else if (selectedListID.nextElementSibling) {
            selectedListID = selectedListID.nextElementSibling;
        }
    }
    saveAndRender();
}

// function deleteTask(e) {
//     if(e.target.closest("div").classList.contains("task")) {
//         let closestTaskDiv = e.target.closest("div");
//         closestTaskDiv.parentNode.removeChild(closestTaskDiv);

//         const selectedList = lists.find(list => list.id === selectedListID);
//         selectedList.tasks.forEach(task => {
//             if(task.id == closestTaskDiv.id) {
//                 let storageKey = task.name;
//                 localStorage.removeItem(storageKey);
//             }
//         })
         
        
        
//         const selectedList = lists.find(list => list.id === selectedListID);
//         selectedList.tasks.forEach(task => {
//             if(task.id == closestTaskDiv.id) {
//                 task.outerHTML = "";
//             }
//         })
//     }
        
//     saveAndRender();
// }

render();