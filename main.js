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
let filteredList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FILTERED_LIST)) || [];

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

let pen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-230 -220 900 900"><path d="M421.7 220.3L188.5 453.4L154.6 419.5L158.1 416H112C103.2 416 96 408.8 96 400V353.9L92.51 357.4C87.78 362.2 84.31 368 82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3zM492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75z"/></svg>`
let cross = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/></svg>`
let quoteContainer = document.querySelector("[data-quote-container]");

let deleteBtn = document.querySelectorAll(".delete-btn");
let newQuoteBtn = document.querySelector(".new-quote");
let darkModeBtn = document.querySelector(".light-dark-mode");
let themeChanger = document.querySelector("#theme");
let filterBtn = document.querySelector(".filter");
let editBtn = document.querySelectorAll(".edit-btn")
let menuBtn = document.querySelector(".menu");


listsContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "li" && e.target.tagName.toLowerCase() !== "button") {
        selectedListID = e.target.dataset.listId;
        saveAndRender();
    }
})

listsContainer.addEventListener("click", e => {
    if(e.target.classList.contains("delete-btn")) {
        deleteList(e);
    }
})

tasksContainer.addEventListener("click", e => {
    if(e.target.classList.contains("delete-btn")) {
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
        let selectedList = lists.find(list => list.id == selectedListID) || lists[0];
        selectedList.tasks.push(newTask);
        saveAndRender();
    }
})

themeChanger.addEventListener('change', function() {
    document.body.style.backgroundImage = this.value;
    chosenBackground = this.value;
    saveAndRender()
});

filterBtn.addEventListener("click", (e) => {
    
    let selectedList = lists.find(list => list.id === selectedListID);
    console.log(selectedList)
    
    if(!e.target.classList.contains("show") && !e.target.tagName.toLowerCase() == "p") return;

    if(e.target.classList.contains("show-all")) {
        filterBtn.querySelectorAll(".show").forEach(btn => btn.classList.remove("active-filter"));
        e.target.classList.add("active-filter")
        filteredList.tasks = selectedList.tasks
    } else if(e.target.classList.contains("show-done")) {
        filterBtn.querySelectorAll(".show").forEach(btn => btn.classList.remove("active-filter"));
        e.target.classList.add("active-filter")
        filteredList.tasks = selectedList.tasks.filter(task => task.done)
    } else if(e.target.classList.contains("show-active")) {
        filterBtn.querySelectorAll(".show").forEach(btn => btn.classList.remove("active-filter"));
        e.target.classList.add("active-filter")
        filteredList.tasks = selectedList.tasks.filter(task => !task.done)
    } else if(e.target.classList.contains("clear-done") || e.target.tagName.toLowerCase() == "p") {
        selectedList.tasks = selectedList.tasks.filter(task => !task.done)
        filteredList.tasks = selectedList.tasks;
    }
    clear(tasksContainer);
    save();
    renderTasks(filteredList);
})

tasksContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("edit-btn")) {
        if(e.target.previousElementSibling.contentEditable == "false") {
            e.target.innerText = "Save"
            let text = e.target.previousElementSibling;
            text.setAttribute("contenteditable", true)
            focusOnEnd(text);
        } else if(e.target.previousElementSibling.contentEditable == "true") {
            e.target.innerText = "Edit"
            const selectedList = lists.find(list => list.id === selectedListID);
            let selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
            let text = e.target.previousElementSibling;
            text.blur()
            selectedTask.name = text.innerText;
            text.setAttribute("contenteditable", false)
            save()
        }
    }})

menuBtn.addEventListener("click", (e) => {
    if(sidebar.classList.contains("showup-animation")) {
        mainTasksContainer.classList.toggle("showup-animation");
        sidebar.classList.toggle("showup-animation");
        menuBtn.innerHTML = cross;
    } else if (mainTasksContainer.classList.contains("showup-animation")) {
        sidebar.classList.toggle("showup-animation");
        mainTasksContainer.classList.toggle("showup-animation");
        menuBtn.innerHTML = "&#10006;";
    }
})

function focusOnEnd(el) {  
    const selection = window.getSelection();  
    const range = document.createRange();  
    selection.removeAllRanges();  
    range.selectNodeContents(el);  
    range.collapse(false);  
    selection.addRange(range);  
    el.focus();
}

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
    clear(tasksContainer);
    checkDarkMode(darkMode);
    renderTasks(selectedList);
    checkBackground(chosenBackground);
}

function showListName(selectedList) {
    if(selectedList) {
    listName.innerText = selectedList.name;
    }
}

function showTasksCount(selectedList) {
    if (!selectedList || !selectedList.tasks) {
        listTasksCount.innerText = `0 tasks remaining`;
    } else {
    const activeTasks = selectedList.tasks.filter(task => !task.done).length;
    const taskString = activeTasks === 1 ? "task" : "tasks";
    listTasksCount.innerText = `${activeTasks} ${taskString} remaining`;
    }
}

function renderLists() {
    let header = document.querySelector(".tasks-header");
    let tasksContainer = document.querySelector(".tasks-container");
    let filter = document.querySelector(".filter");
    let selectedList = lists.find(list => list.id === selectedListID) || lists[0];

    if(lists.length <= 0) {
        newTaskForm.style.display = "none";
        header.style.display = "none";
        tasksContainer.style.display = "none";
        filter.style.display = "none";
    } else {
        selectedListID = selectedList.id;
        selectedList = lists.find(list => list.id === selectedListID);
        
        newTaskForm.style.display = "";
        header.style.display = "";
        tasksContainer.style.display = "";
        filter.style.display = "";
        
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
                deleteBtn.innerHTML = "&#10006;";
                deleteBtn.style.marginLeft = "1rem";
                list.append(deleteBtn);
            }
            listsContainer.append(list);
        })}
        
        save()
        showListName(selectedList);
        showTasksCount(selectedList);
    };

function renderTasks(selectedList) {
    if(!selectedList) return;

    selectedList.tasks.forEach(task => {
        let taskInner = document.createElement("div");
        taskInner.innerHTML = `
            <input type="checkbox" id="${task.id}">
            <label for="${task.id}"><span class="custom-checkbox"></span><p class="task-text" contenteditable="false">${task.name}</p><button class="edit-btn">Edit</button><button class="delete-btn">&#10006;</button></label>    
        `;
        taskInner.classList.add("task");
        taskInner.dataset.taskId = task.id;

        let editBtn = taskInner.querySelector(".edit-btn");
        editBtn.id = task.id;

        let deleteBtn = taskInner.querySelector(".delete-btn");
        deleteBtn.id = task.id;
        
        let checkbox = taskInner.querySelector("input[type=checkbox]");
        checkbox.id = task.id;
        checkbox.checked = task.done;
        tasksContainer.appendChild(taskInner);
    })

    checkDarkMode(darkMode);

    Sortable.create(tasksContainer, {
        animation: 150,
        ghostClass: 'dragBg',
        onUpdate: function checkOrder() {
            const currentList = lists.find(list => list.id === selectedListID);
            let newOrder = [];
            let tasks = document.querySelectorAll("[data-task-id]");
            tasks.forEach(taskDiv => {
                for(let task of currentList.tasks) {
                    if(taskDiv.dataset.taskId == task.id) {
                        newOrder.push(task)
                    }
                }
            })
            currentList.tasks = newOrder;
            save()
        }
    })
}

function clear(element) {
    element.innerHTML = "";
}

function checkDarkMode(darkMode) {
    let input = document.querySelectorAll("input");
    let select = document.querySelectorAll("select");
    let option = document.querySelectorAll("option");
    let button = document.querySelectorAll("button");
    let taskText = document.querySelectorAll(".task-text");

    if(darkMode == "enabled") {
        input.forEach(item => item.classList.remove("light-mode-input"));
        select.forEach(item => item.classList.remove("light-mode-input"));
        option.forEach(item => item.classList.remove("light-mode"));
        taskText.forEach(item => item.classList.remove("light-mode-input"));
        button.forEach(item => item.classList.remove("light-mode-input"));
        sidebar.classList.remove("light-mode");
        mainTasksContainer.classList.remove("light-mode");
        quoteContainer.classList.remove("light-mode");

        input.forEach(item => item.classList.add("dark-mode-input"));
        select.forEach(item => item.classList.add("dark-mode-input"));
        option.forEach(item => item.classList.add("dark-mode"));
        taskText.forEach(item => item.classList.add("dark-mode-input"));
        button.forEach(item => item.classList.add("dark-mode-input"));
        sidebar.classList.add("dark-mode");
        mainTasksContainer.classList.add("dark-mode");
        quoteContainer.classList.add("dark-mode");

    } else if (darkMode == null) {
        input.forEach(item => item.classList.remove("dark-mode-input"));
        select.forEach(item => item.classList.remove("dark-mode-input"));
        option.forEach(item => item.classList.remove("dark-mode"));
        taskText.forEach(item => item.classList.remove("dark-mode-input"));
        button.forEach(item => item.classList.remove("dark-mode-input"));
        sidebar.classList.remove("dark-mode");
        mainTasksContainer.classList.remove("dark-mode");
        quoteContainer.classList.remove("dark-mode");

        input.forEach(item => item.classList.add("light-mode-input"));
        select.forEach(item => item.classList.add("light-mode-input"));
        option.forEach(item => item.classList.add("light-mode"));
        taskText.forEach(item => item.classList.add("light-mode-input"));
        button.forEach(item => item.classList.add("light-mode-input"));
        sidebar.classList.add("light-mode");
        mainTasksContainer.classList.add("light-mode");
        quoteContainer.classList.add("light-mode");
    }
    save()
}

function deleteList(e) {
    console.log(lists)
    if(e.target.closest("li").classList.contains("list")) {
        let index = lists.findIndex(list => list.id == selectedListID);
        if (index > -1) {
            lists.splice(index, 1);
        }

        if(lists.length > 0) {
            if(lists[index - 1]) {
            selectedListID = lists[index - 1].id;
            } else if(lists[0]) {
            selectedListID = lists[0].id;
            } else {
            selectedList = null;
            }
        }   
    }
    saveAndRender();
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
    let input = document.querySelectorAll("input");
    let select = document.querySelectorAll("select");
    let option = document.querySelectorAll("option");
    let button = document.querySelectorAll("button");
    let taskText = document.querySelectorAll(".task-text");
    if(darkMode == null) {
        input.forEach(item => item.classList.remove("light-mode-input"));
        select.forEach(item => item.classList.remove("light-mode-input"));
        option.forEach(item => item.classList.remove("light-mode"));
        taskText.forEach(item => item.classList.remove("light-mode-input"));
        button.forEach(item => item.classList.remove("light-mode-input"));
        sidebar.classList.remove("light-mode");
        mainTasksContainer.classList.remove("light-mode");
        quoteContainer.classList.remove("light-mode");

        input.forEach(item => item.classList.add("dark-mode-input"));
        select.forEach(item => item.classList.add("dark-mode-input"));
        option.forEach(item => item.classList.add("dark-mode"));
        taskText.forEach(item => item.classList.add("dark-mode-input"));
        button.forEach(item => item.classList.add("dark-mode-input"));
        sidebar.classList.add("dark-mode");
        mainTasksContainer.classList.add("dark-mode");
        quoteContainer.classList.add("dark-mode");
        darkMode = "enabled";
    } else if (darkMode == "enabled") {
        input.forEach(item => item.classList.remove("dark-mode-input"));
        select.forEach(item => item.classList.remove("dark-mode-input"));
        option.forEach(item => item.classList.remove("dark-mode"));
        taskText.forEach(item => item.classList.remove("dark-mode-input"));
        button.forEach(item => item.classList.remove("dark-mode-input"));
        sidebar.classList.remove("dark-mode");
        mainTasksContainer.classList.remove("dark-mode");
        quoteContainer.classList.remove("dark-mode");

        input.forEach(item => item.classList.add("light-mode-input"));
        select.forEach(item => item.classList.add("light-mode-input"));
        option.forEach(item => item.classList.add("light-mode"));
        taskText.forEach(item => item.classList.add("light-mode-input"));
        button.forEach(item => item.classList.add("light-mode-input"));
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