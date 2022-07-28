// goes to document and grabs all elements with the class name "fa-trash"
const deleteBtn = document.querySelectorAll(".fa-trash");
// goes to document and grabs all span elements and elements with the class name "item"
const item = document.querySelectorAll(".item span");
// goes to document grabs all elements with the class name "item" and all spans with the class name of "completed"
const itemCompleted = document.querySelectorAll(".item span.completed");

// creates an array from deleteBtn (the trash can icon) and loops through the array
Array.from(deleteBtn).forEach((element) => {
  // adds an event listener to each element (trash can), firing the deleteItem function when element is clicked
  element.addEventListener("click", deleteItem);
});

// creating an array from item and loops through the array
Array.from(item).forEach((element) => {
  // adds an event listener to each element, firing the markComplete function when element is clicked
  element.addEventListener("click", markComplete);
});

// creating an array from itemCompleted (todos with a line through them) and loops through array
Array.from(itemCompleted).forEach(
  // adds event listener to each one element, firing the markUnComplete function when element is clicked
  (element) => {
    element.addEventListener("click", markUnComplete);
  }
);

// asynchronous function tied to an event listener
async function deleteItem() {
  // go to the parent of the item/task  clicked and then go to the first child node (which should be an item/task) and put the text in the DOM
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // DELETE request using fetch to deleteItem path
    const response = await fetch("deleteItem", {
      // defining the request as a DELETE request
      method: "delete",
      // request/response HTTP headers will be JSON
      headers: { "Content-Type": "application/json" },
      // convert JSON into string 
      body: JSON.stringify({
        // takes the value of itemFromJS (itemText) and deletes it
        itemFromJS: itemText,
      }),
    });
    // responds with data as JSON
    const data = await response.json();
    // logs data to the console
    console.log(data);
    // refresh the page
    location.reload();
    // error handling
  } catch (err) {
    // logs any errors with the function to the console
    console.log(err);
  }
}

// asynchronous function tied to an event listener
async function markComplete() {
  // go to the parent of the item/task  clicked and then go to the first child node (which should be an item/task) and put the text in the DOM
  const itemText = this.parentNode.childNodes[1].innerText;
  // error handling
  try {
    // PUT request using fetch to the markComplete path
    const response = await fetch("markComplete", {
      // defining the request as a PUT request
      method: "put",
      // request/response HTTP headers will be JSON
      headers: { "Content-Type": "application/json" },
      // convert JSON into string
      body: JSON.stringify({
        // takes the value of itemFromJS and updates it to itemText
        itemFromJS: itemText,
      }),
    });
    // responds with data as JSON
    const data = await response.json();
    // logs data to console
    console.log(data);
    // refresh the page
    location.reload();
    // error handling
  } catch (err) {
    // logs any errors with the function to the console
    console.log(err);
  }
}

// asynchronous PUT request tied to an event listener
async function markUnComplete() {
  // go to the parent of the item/task  clicked and then go to the first child node (which should be an item/task) and put the text in the DOM
  const itemText = this.parentNode.childNodes[1].innerText;
  // error handling
  try {
    // PUT request using fetch to the /markUnComplete path
    const response = await fetch("markUnComplete", {
      // defining the request as a PUT request
      method: "put",
      // request/response HTTP headers will be JSON
      headers: { "Content-Type": "application/json" },
      // convert JSON into string 
      body: JSON.stringify({
        // takes the value of itemFromJS and updates it to itemText
        itemFromJS: itemText,
      }),
    });
    // responds with data as JSON
    const data = await response.json();
    // logs data to the console
    console.log(data);
    // refresh the page
    location.reload();
    // error handling
  } catch (err) {
    // logs any errors with the function to the console
    console.log(err);
  }
}
