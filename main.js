const LOCAL_STORAGE_LISTS = "todo.lists"

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS)) || [];

let listsContainer = document.querySelector("[data-lists]");
let newListForm = document.querySelector("[data-new-list-form]");
let newListInput = document.querySelector("[data-new-list-input]");

newListForm.addEventListener("submit", e => {
    e.preventDefault();
    let listName = newListInput.value;
    if(listName !==null || listName !== "") {
        let newList = createList(listName);
        newListInput.value = null;
        lists.push(newList);
        saveAndRender()
    }
})

function createList(name) {
    return { id: Date.now().toString(),
            name: name,
            todos: []
            }
}

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LISTS, JSON.stringify(lists))
}

function render() {
    clear(listsContainer);
    lists.forEach(item => {
        const list = document.createElement("li");
        list.classList.add("list");
        list.tabIndex = 0;
        list.dataset.listId = list.id;
        list.innerText = item.name;
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