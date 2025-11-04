// The frontend client-side code that wires up the todo list UI to te backend routes

// Select all delete icons, all todo text spans and all completed todos, to let these attach
// behaviour to each matching element in the NodeList
const deleteBtn = document.querySelectorAll(".fa-trash");
const item = document.querySelectorAll(".item span");
const itemCompleted = document.querySelectorAll(".item span.completed");

// For every delete icon, add a click listener that triggers the deleteItem function/handler.
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// For every incomplete todo text span, add a click listener that triggers the markComplete function/handler.
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// For every completed todo text span, add a click listener that triggers the markUnComplete function/handler.
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// A handler for deleting a todo items, it runs in the context of the clicked delete icon (`this`).
// Reads the text of the todo from the DOM, sends it to the server in a DELETE request.
async function deleteItem() {
  // Go from the clicked this icon to its parent element, then to the second child node which is the span containing the text, then grab the text of the todo item.
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("deleteItem", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      // Send the todo text in the request body so the server knows which item to delete.
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Get the JSON response from the server and log it, then reload the page to reflect the change
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    // If anything goes wrong with the request, log the error.
    console.log(err);
  }
}
// Handler for marking a todo as complete, similar to deleteItem, but sends a PUT/update request
// to the markComplete route, expecting the server to update the completed state of the item
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// Handler for marking a todo as not complete, Sends a PUT/update request to the markUnComplete
// route so the server can toggle the state to completed: false
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
