const addBtns = document.querySelectorAll(".add-btn:not(.solid)")
const saveItemBtns = document.querySelectorAll(".solid")
const addItemContainers = document.querySelectorAll(".add-container")
const addItems = document.querySelectorAll(".add-item")
// Item Lists
const listColumn = document.querySelectorAll(".drag-item-list")
const backlogList = document.getElementById("backlog-list")
const progressList = document.getElementById("progress-list")
const completeList = document.getElementById("complete-list")
const onHoldList = document.getElementById("on-hold-list")

// Items
let updateOnLoad = false

// Initialize Arrays
let backlogListArray = []
let progressListArray = []
let completeListArray = []
let onHoldListArray = []
let listArrays = []
// Drag Functionality
let draggedItem
let currentColumn

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems)
    progressListArray = JSON.parse(localStorage.progressItems)
    completeListArray = JSON.parse(localStorage.completeItems)
    onHoldListArray = JSON.parse(localStorage.onHoldItems)
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"]
    progressListArray = ["Work on projects", "Listen to music"]
    completeListArray = ["Being cool", "Getting stuff done"]
    onHoldListArray = ["Being uncool", "Morir de sueño"]
  }
}
// Set localStorage Arrays

function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ]
  const arrayKeys = ["backlog", "progress", "complete", "onHold"]
  arrayKeys.forEach((arrayKeys, index) => {
    localStorage.setItem(`${arrayKeys}Items`, JSON.stringify(listArrays[index]))
  })
}

//Esta funcion filtra el array para remover items vacios

// function filterArray(array) {
//   console.log(array)
//   const arrayFiltered = array.filter((item) => !item == null)
//   console.log(arrayFiltered)
// }

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li")
  listEl.classList.add("drag-item")
  listEl.textContent = item
  listEl.draggable = true
  listEl.setAttribute("ondragstart", "drag(event)")
  listEl.contentEditable = true
  listEl.id = index
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`)
  //Appending item to List
  columnEl.appendChild(listEl)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updateOnLoad) {
    getSavedColumns()
  }

  // Backlog Column
  backlogList.textContent = ""
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index)
  })
  // backlogListArray = filterArray(backlogListArray)
  // Progress Column

  progressList.textContent = ""
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index)
  })
  //  progressListArray = filterArray(progressListArray)
  // Complete Column

  completeList.textContent = ""
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index)
  })
  //completeListArray = filterArray(completeListArray)
  // On Hold Column

  onHoldList.textContent = ""
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index)
  })
  //  onHoldListArray = filterArray(onHoldListArray)
  // Run getSavedColumns only once, Update Local Storage
  updateOnLoad = true
  updateSavedColumns()
}

//Update item or if necessary delete or update the array value

function updateItem(id, column) {
  const selectedArray = listArrays[column]
  console.log(selectedArray)
  const selectedColumnEl = listColumn[column].children

  if (!selectedColumnEl[id].textContent) {
    delete selectedArray[id]
  }
  console.log(selectedArray)
  updateDOM()
}

function addItemColumn(column) {
  const itemAdded = addItems[column].textContent
  const selectedArray = listArrays[column]
  selectedArray.push(itemAdded)
  addItems[column].textContent = ""
  updateDOM()
}

//Show input box

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden"
  saveItemBtns[column].style.display = "flex"
  addItemContainers[column].style.display = "flex"
}

//Hide input box

function hideInputBox(column) {
  addBtns[column].style.visibility = "visible"
  saveItemBtns[column].style.display = "none"
  addItemContainers[column].style.display = "none"
  addItemColumn(column)
}

//Rebuilding arrays with new value
function rebuildArray() {
  backlogListArray = []
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent)
  }
  progressListArray = []
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent)
  }
  completeListArray = []
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent)
  }
  onHoldListArray = []
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent)
  }
  updateDOM()
}

//When the item starts to get dropped

function drag(e) {
  draggedItem = e.target
}

function allowDrop(e) {
  e.preventDefault()
}

function dragEnter(column) {
  listColumn[column].classList.add("over")
  currentColumn = column
}

function drop(e) {
  e.preventDefault()

  //Remove background color and padding
  listColumn.forEach((column) => {
    column.classList.remove("over")
  })
  //Add item to column
  const parent = listColumn[currentColumn]

  parent.appendChild(draggedItem)

  rebuildArray()
}

updateDOM()
