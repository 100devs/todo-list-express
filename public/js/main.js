// Select the icon with the class of ".fa-trash" from the DOM and store it in a variable (deleteBtn)
const deleteBtn = document.querySelectorAll(".fa-trash");
// Select the span with the class of ".item" from the DOM and store it in a varaible (item)
const item = document.querySelectorAll(".item span");
// Select the elements with the class of ".item" that are spans with the class of ".completed" from the DOM and store it in a variable (itemCompleted)
const itemCompleted = document.querySelectorAll(".item span.completed");

// Create an array instance from the variable "deleteBtn"
Array.from(deleteBtn).forEach((element) => {
  // For each element in the array add an event listener that listens for a "click" and fires the callback "deleteItem" func
  element.addEventListener("click", deleteItem);
});

// Create an array instance from the variable "item"
Array.from(item).forEach((element) => {
  // For each element in the array add an event listener that listens for a "click" and fires the callback "markComplete" func
  element.addEventListener("click", markComplete);
});

// Create an array instance from the variable "itemCompleted"
Array.from(itemCompleted).forEach((element) => {
  // For each element in the array add an event listener that listens for a "click" and fires the callback "markUnComplete" func
  element.addEventListener("click", markUnComplete);
});

// An async function named "deleteItem" that's function is to delete items from the todo list
async function deleteItem() {
  // Store the inner text of the childNode within the parentNode of the obj in a variable named "itemText"
  const itemText = this.parentNode.childNodes[1].innerText;
  // Initialize a try/catch for the async await func "deleteItem"
  try {
    // The variable "response" will await a fetch "deleteItem" and return a promise
    const response = await fetch("deleteItem", {
      // The server will delete the item
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // The variable "data" will store our response in JSON format
    const data = await response.json();
    // Log the data to the console
    console.log(data);
    // Refresh the location
    location.reload();
    // Catches an error if the promise is unfulfilled
  } catch (err) {
    // Logs the error to the console
    console.log(err);
  }
}
// An async function named "markComplete" that's function is to mark todo items complete
async function markComplete() {
  // Store the inner text of the childNode within the parentNode of the obj in a variable named "itemText"
  const itemText = this.parentNode.childNodes[1].innerText;
  // Initialize a try/catch for the async await func "markComplete"
  try {
    // The variable "response" will await a fetch "markComplete" and return a promise
    const response = await fetch("markComplete", {
      // The server will update the todo item
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // The variable "data" will store our response in JSON format
    const data = await response.json();
    // Log the data to the console
    console.log(data);
    // Refresh the location
    location.reload();
    // Catches an error if the promise is unfulfilled
  } catch (err) {
    // Logs the error to the console
    console.log(err);
  }
}

// An async function named "markUnComplete" that's function is to mark todo items uncomplete
async function markUnComplete() {
  // Store the inner text of the childNode within the parentNode of the obj in a variable named "itemText"
  const itemText = this.parentNode.childNodes[1].innerText;
  // Initialize a try/catch for the async await func "markUnComplete"
  try {
    // The variable "response" will await a fetch "markUnComplete" and return a promise
    const response = await fetch("markUnComplete", {
      // The server will update the todo item
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // The variable "data" will store our response in JSON format
    const data = await response.json();
    // Log the data to the console
    console.log(data);
    // Refresh the location
    location.reload();
    // Catches an error if the promise is unfulfilled
  } catch (err) {
    // Logs the error to the console
    console.log(err);
  }
}
