const LOCAL_STORAGE_LISTS = "todo.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID = "todo.selectedListID"
// const LOCAL_STORAGE_TASKS = "todo.tasks"

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS)) || [];
// let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS)) || [];
let selectedListID = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);



let listsContainer = document.querySelector("[data-lists]");
let newListForm = document.querySelector("[data-new-list-form]");
let newListInput = document.querySelector("[data-new-list-input]");
// let newTaskForm = document.querySelector("[data-new-task-form]");
// let newTaskInput = document.querySelector("[data-new-task-input]");


listsContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "li") {
        selectedListID = e.target.dataset.listId;
        saveAndRender();
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
            todos: []
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
    // localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(tasks))
}

function render() {
    clear(listsContainer);
    lists.forEach(item => {
        const list = document.createElement("li");
        list.classList.add("list");
        list.dataset.listId = item.id;
        list.innerText = item.name;
        console.log(selectedListID)
        console.log(list.dataset.listId)
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

function clear(element) {
    element.innerHTML = "";
}

render();



// let list = document.querySelectorAll("list");
// list.forEach(elem => elem.addEventListener("click", e => {
//     if(e.target.classList = "list") {
//         e.target.classList.add("active");
//     }
// }))