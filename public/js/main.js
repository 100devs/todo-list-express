// Get all elements with class "fa-trash" and store them in deleteBtn variable
const deleteBtn = document.querySelectorAll(".fa-trash");
// Get all elements with class "item span" and store them in item variable
const item = document.querySelectorAll(".item span");
// Get all elements with class "item span completed" and store them in itemCompleted variable
const itemCompleted = document.querySelectorAll(".item span.completed");

// Loop through each element in the deleteBtn list and add a click event listener to each
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// Loop through each element in the item list and add a click event listener to each
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// Loop through each element in the itemCompleted list and add a click event listener to each
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// Define asynchronous function to handle item deletion
async function deleteItem() {
  // Get the text content of the sibling span element within the same parent node
  const itemText = this.parentNode.childNodes[1].innerText;
  // try block
  try {
    // Send a DELETE request to the "deleteItem" endpoint with JSON data
    const response = await fetch("deleteItem", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // parse the response as JSON
    const data = await response.json();
    // Log the response data to console
    console.log(data);
    // Reload the page to reflect the changes
    location.reload();
  } catch (err) {
    // catch block to handle and log any errors that occur during the request
    console.log(err);
  }
}

// Define an asynchronous function to mark an item as complete
async function markComplete() {
  // Get the text content of the sibling span element within the same parent node
  const itemText = this.parentNode.childNodes[1].innerText;
  // try block
  try {
    // Send a PUT request to the "markComplete" endpoint with JSON data
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Parse the response as JSON
    const data = await response.json();
    // Log the response data to console
    console.log(data);
    // Reload the page to reflect changes
    location.reload();
  } catch (err) {
    // catch block to handle and log any errors that occur during the request
    console.log(err);
  }
}

// Define an asynchronous function to mark an item as incomplete
async function markUnComplete() {
  // Get the text content of the sibling span element within the same parent node
  const itemText = this.parentNode.childNodes[1].innerText;
  // try block
  try {
    // Send a PUT request to the "markUnComplete" endpoint with JSON data
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // parse the response as JSON
    const data = await response.json();
    // Log the response data to console
    console.log(data);
    // Reload the page to reflect changes
    location.reload();
  } catch (err) {
    // catch block to handle and log any errors that occur during the request
    console.log(err);
  }
}
