const LOCAL_STORAGE_LISTS = "task.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID = "task.selectedListID"
const LOCAL_STORAGE_TASKS = "task.tasks"
const LOCAL_STORAGE_DARK_MODE = "mode.darkMode"
const LOCAL_STORAGE_CHOSEN_BG = "theme.chosenBackground"
const LOCAL_STORAGE_FILTERED_LIST = "task.filtered"

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS)) || [];
let selectedListID = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);
let darkMode = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DARK_MODE));
let chosenBackground = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHOSEN_BG)) || "url(./images/ancient1.jpg)";
let filteredList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FILTERED_LIST))

let sidebar = document.querySelector("[data-sidebar]");
let listsContainer = document.querySelector("[data-lists]");
let newListForm = document.querySelector("[data-new-list-form]");
let newListInput = document.querySelector("[data-new-list-input]");

let newTaskForm = document.querySelector("[data-new-task-form]");
let newTaskInput = document.querySelector("[data-new-task-input]");
let mainTasksContainer = document.querySelector("[data-tasks-main]");
let tasksContainer = document.querySelector("[data-tasks]");
let listName = document.querySelector("[data-list-name]");
let listTasksCount = document.querySelector("[data-list-count]");


let quoteContainer = document.querySelector("[data-quote-container]");

let deleteBtn = document.querySelectorAll(".delete-btn");
let newQuoteBtn = document.querySelector(".new-quote");
let darkModeBtn = document.querySelector(".light-dark-mode");
let themeChanger = document.querySelector("#theme");
let filterBtn = document.querySelector(".filter");


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

themeChanger.addEventListener('change', function() {
    document.body.style.backgroundImage = this.value;
    chosenBackground = this.value;
    console.log(this.value)
    saveAndRender()
});

filterBtn.addEventListener("click", (e) => {
    
    const selectedList = lists.find(list => list.id === selectedListID);
    let createdTask = document.querySelectorAll("[data-task-id]");

    if(e.target.classList.contains("show-all")) {
        filteredList.tasks = selectedList.tasks
    } else if(e.target.classList.contains("show-done")) {
        filteredList.tasks = selectedList.tasks.filter(task => {
            for(let current of createdTask) {
                if (current.dataset.taskId == task.id && task.done) {
                    return true;
                }}})
    } else if(e.target.classList.contains("show-active")) {
        {
            filteredList.tasks = selectedList.tasks.filter(task => {
                for(let current of createdTask) {
                    if (current.dataset.taskId == task.id && !task.done) {
                        return true;
                    }}})
    }}
    console.log(filteredList)
    clear(tasksContainer)
    save()
    renderTasks(filteredList);
    // render something
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
    localStorage.setItem(LOCAL_STORAGE_DARK_MODE, JSON.stringify(darkMode))
    localStorage.setItem(LOCAL_STORAGE_CHOSEN_BG, JSON.stringify(chosenBackground))
    localStorage.setItem(LOCAL_STORAGE_FILTERED_LIST, JSON.stringify(filteredList))
}

function render() {
    const selectedList = lists.find(list => list.id === selectedListID);

    clear(listsContainer);
    renderLists();
    showListName(selectedList);
    showTasksCount(selectedList);
    clear(tasksContainer)
    renderTasks(selectedList);
    checkDarkMode(darkMode);
    checkBackground(chosenBackground);
}

function showListName(selectedList) {
    if(selectedList) {
    listName.innerText = selectedList.name;
    }
}

function showTasksCount(selectedList) {
    if (selectedList.tasks.length == 0) {
        listTasksCount.innerText = `0 tasks remaining`;
    } else {
    const activeTasks = selectedList.tasks.filter(task => !task.done).length;
    const taskString = activeTasks === 1 ? "task" : "tasks";
    listTasksCount.innerText = `${activeTasks} ${taskString} remaining`;
    }
}

function renderLists() {
    // if(lists.length < 1) {
    //     mainTasksContainer.style.opacity = 0;
    // } else {
    lists.forEach(item => {
        // mainTasksContainer.style.opacity = 1;
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
    })}
// }

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        let taskInner = document.createElement("div");
        taskInner.innerHTML = `
            <input type="checkbox" id="${task.id}">
            <label for="${task.id}"><span class="custom-checkbox"></span>${task.name}<button class="delete-btn">x</button></label>    
        `;
        taskInner.classList.add("task");
        taskInner.dataset.taskId = task.id;

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

function checkDarkMode(darkMode) {
    if(darkMode == "enabled") {
        sidebar.classList.remove("light-mode");
        mainTasksContainer.classList.remove("light-mode");
        quoteContainer.classList.remove("light-mode");
        sidebar.classList.add("dark-mode");
        mainTasksContainer.classList.add("dark-mode");
        quoteContainer.classList.add("dark-mode");
    } else if (darkMode == null) {
        sidebar.classList.remove("dark-mode");
        mainTasksContainer.classList.remove("dark-mode");
        quoteContainer.classList.remove("dark-mode");
        sidebar.classList.add("light-mode");
        mainTasksContainer.classList.add("light-mode");
        quoteContainer.classList.add("light-mode");
    }
}

function deleteList(e) {
    if(e.target.closest("li").classList.contains("list")) {
        let index = lists.findIndex(list => list.id == selectedListID);
        if (index > -1) {
            lists.splice(index, 1);
            if(lists.length > 0) {
                selectedListID = lists[index - 1].id;
            } else {
                selectedList = [];
            }
        }
        saveAndRender();
    }
    
}

function deleteTask(e) {
    if(e.target.closest("div").classList.contains("task")) {
        let closestTaskDiv = e.target.closest("div");
        const selectedList = lists.find(list => list.id === selectedListID);
        let index = selectedList.tasks.findIndex(task => task.id == closestTaskDiv.dataset.taskId);
        if (index > -1) {
            selectedList.tasks.splice(index, 1);  
        }
    }
    saveAndRender();
}

newQuoteBtn.addEventListener("click", () => {
    let quoteContainer = document.querySelector(".quote");
    let authorContainer = document.querySelector(".person");

    getQuote(quoteContainer, authorContainer);
})

    async function getQuote(quoteContainer, authorContainer) {
        let response = await fetch("https://api.quotable.io/random");
        let quote = await response.json();
        if(response.ok) {
            quoteContainer.innerText = quote.content;
            authorContainer.innerText = `- ${quote.author}`;
        } else {
            quoteContainer.innerText = "Houston, we have a problem here..."
            authorContainer.innerText = `Error...`;
        }

    }

darkModeBtn.addEventListener("click", () => {
    console.log(darkMode)
    if(darkMode == null) {
        sidebar.classList.remove("light-mode");
        mainTasksContainer.classList.remove("light-mode");
        quoteContainer.classList.remove("light-mode");
        sidebar.classList.add("dark-mode");
        mainTasksContainer.classList.add("dark-mode");
        quoteContainer.classList.add("dark-mode");
        darkMode = "enabled";
    } else if (darkMode == "enabled") {
        sidebar.classList.remove("dark-mode");
        mainTasksContainer.classList.remove("dark-mode");
        quoteContainer.classList.remove("dark-mode");
        sidebar.classList.add("light-mode");
        mainTasksContainer.classList.add("light-mode");
        quoteContainer.classList.add("light-mode");
        darkMode = null;
    }
    save();
})



function checkBackground(chosenBackground) {
    let options = document.querySelectorAll("option");
    options = Array.from(options);
    let selectedValue = options.find(item => item.value == chosenBackground);
    selectedValue.selected = true;
    document.body.style.backgroundImage = chosenBackground;
    save();
}


render();