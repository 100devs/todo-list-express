// goes to document and grabs all elements with the class name "fa-trash"
const deleteBtn = document.querySelectorAll(".fa-trash");
// goes to document and grabs all <span/> elements that are children of the elements (<li/>) with the class name "item"
const item = document.querySelectorAll(".item span");
// goes to document and grabs all <span/> elements that are children of the elements (<li/>) with the class name "item" and all <spans/> with the class name of "completed"
const itemCompleted = document.querySelectorAll(".item span.completed");

// creates an array from deleteBtn (the <span/>'s with the trash can icon) and loops through the array
Array.from(deleteBtn).forEach((element) => {
  // adds an event listener to each <span/> element (trash can), firing the deleteItem function when element is clicked
  element.addEventListener("click", deleteItem);
});

// creating an array from <span/> that are children of the parent with class="item" (<li/>) and loops through the array
Array.from(item).forEach((element) => {
  // adds an event listener to each child element (<span/>) within parent class="item" (<li/>), firing the markComplete function when element is clicked
  element.addEventListener("click", markComplete);
});

// creating an array from itemCompleted (todos with a line through them) and loops through array
Array.from(itemCompleted).forEach(
  // adds an event listener to each child element (<span class="completed"/>) within parent class="item" (<li/>), firing the markUnComplete function when element is clicked
  (element) => {
    element.addEventListener("click", markUnComplete);
  }
);

// asynchronous function/DELETE request tied to an event listener
async function deleteItem() {
  // go to the parent of the item/task clicked (<li/>) and then go to the first child node (which should be an item/task in <span/>) and grabs the text from the DOM
  const itemText = this.parentNode.childNodes[1].innerText;
  // error handling
  try {
    // DELETE request using fetch to deleteItem path to the server
    const response = await fetch("deleteItem", {
      // defining the request as a DELETE request
      method: "delete",
      // request/response HTTP headers will be JSON
      headers: { "Content-Type": "application/json" },
      // convert JSON into string
      body: JSON.stringify({
        // the value of itemFromJS (itemText) to be deleted
        itemFromJS: itemText,
      }),
    });
    // responds with data as JSON
    const data = await response.json();
    // logs data to the console
    console.log(data);
    // refresh the page, where the deleted information will not be included
    location.reload();
    // error handling
  } catch (err) {
    // logs any errors with the function to the console
    console.log(err);
  }
}

// asynchronous function/PUT request tied to an event listener
async function markComplete() {
  // go to the parent of the item/task clicked (<li/>) and then go to the first child node (which should be an item/task clicked, <span/>) and grab the text from the DOM
  const itemText = this.parentNode.childNodes[1].innerText;
  // error handling
  try {
    // PUT request to the server (using fetch) to the markComplete path
    const response = await fetch("markComplete", {
      // defining the request as a PUT request
      method: "put",
      // request/response HTTP headers will be JSON
      headers: { "Content-Type": "application/json" },
      // convert JSON into string
      body: JSON.stringify({
        // the value of itemFromJS (itemText) to be sent to the server to be updated (this ends up being req.body.itemFromJS on server side)
        itemFromJS: itemText,
      }),
    });
    // responds with data as JSON
    const data = await response.json();
    // logs data to console
    console.log(data);
    // refresh the page, including the updated information
    location.reload();
    // error handling
  } catch (err) {
    // logs any errors with the function to the console
    console.log(err);
  }
}

// asynchronous function/PUT request tied to an event listener
async function markUnComplete() {
  // go to the parent of the item/task (<li/>) clicked and then go to the first child node (which should be an item/task clicked, <span/>) and grab the text from the DOM
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
        // the value of itemFromJS (itemText) to be updated (this ends up being req.body.itemFromJS on server side)
        itemFromJS: itemText,
      }),
    });
    // responds with data as JSON
    const data = await response.json();
    // logs data to the console
    console.log(data);
    // refresh the page, including the updated information
    location.reload();
    // error handling
  } catch (err) {
    // logs any errors with the function to the console
    console.log(err);
  }
}
