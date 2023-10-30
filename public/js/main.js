// Selects all elements with class ".fa-trash" and stores them in deleteBtn variable
const deleteBtn = document.querySelectorAll(".fa-trash");
// Selects all span elements that are descendants of an element with class ".item" and
// stores them in the item variable
const item = document.querySelectorAll(".item span");
// Selects all span elements with a class of ".completed" that are descendants of an
// element with class ".item" and stores them in the itemCompleted variable
const itemCompleted = document.querySelectorAll(".item span.completed");

// Creates an array of all deteleBtn elements to add click event listeners to them that
// calls the deleteItem function when clicked
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// Creates an array of all item elements to add click event listeners to them that calls
// the markComplete function when clicked
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// Creates an array of all itemCompleted elements to add click event listeners to them that
// calls the markUnComplete function when clicked
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// Async function to delete an item when triggered by a click event
async function deleteItem() {
  // Retrieves the text of the second child node of the parent node of the
  // clicked element
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Initiates an async request to the deleteItem endpoint using the Fetch API
    const response = await fetch("deleteItem", {
      // Specifies the HTTP method for the request as delete
      method: "delete",
      // Sets the header for the request to indicate the content type as JSON
      headers: { "Content-Type": "application/json" },
      // Sends data to the server by converting a JavaScript object to a JSON string
      body: JSON.stringify({
        itemFromJS: itemText, // Includes the itemText content in the request body
      }),
    });
    // Parses the JSON response from the server
    const data = await response.json();
    // Logs the response data to the console
    console.log(data);
    // Reloads the current page
    location.reload();
  } catch (err) {
    // Logs any errors that occur to the console
    console.log(err);
  }
}

// Async function to mark an item completed when triggered by a click event
async function markComplete() {
  // Retrieves the text of the second child node of the parent node of the
  // clicked element
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Initiates an async request to the markComplete endpoint using the Fetch API
    const response = await fetch("markComplete", {
      // Specifies the HTTP method for using the request as put
      method: "put",
      // Sets the header for the request to indicate the content type as JSON
      headers: { "Content-Type": "application/json" },
      // Sends data to the server by converting a JavaScript object to a JSON string
      body: JSON.stringify({
        itemFromJS: itemText, // Includes the itemText content in the request body
      }),
    });
    // Parses the JSON response from the server
    const data = await response.json();
    // Logs the response data to the console
    console.log(data);
    // Reloads the current page
    location.reload();
  } catch (err) {
    // Logs any errors that occur to the console
    console.log(err);
  }
}

// Async function to mark an item uncomplete when triggered by a click event
async function markUnComplete() {
  // Retrieves the text of the second child node of the parent node of the
  // clicked element
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Initiates an async request to the markUnComplete endpoint using the Fetch API
    const response = await fetch("markUnComplete", {
      // Specifies the HTTP method for the request as put
      method: "put",
      // Sets the header for the request to indicate the content type as JSON
      headers: { "Content-Type": "application/json" },
      // Sends data to the server by converting a JavaScript object to a JSON string
      body: JSON.stringify({
        itemFromJS: itemText, // Includes the itemText context in the request body
      }),
    });
    // Parses the JSON response from the server
    const data = await response.json();
    // Logs the request data to the console
    console.log(data);
    // Refreshes the current page
    location.reload();
  } catch (err) {
    // Logs any errors that occur to the console
    console.log(err);
  }
}
