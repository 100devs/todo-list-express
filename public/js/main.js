const deleteBtn = document.querySelectorAll(".fa-trash"); // collect all of the trash can span elements
const item = document.querySelectorAll(".item span"); // collect all of the todo list item spans
const itemCompleted = document.querySelectorAll(".item span.completed"); // collect a different list of the item spans that also have the class of completed

Array.from(deleteBtn).forEach((element) => {
  // create an array from the collection (you don't need to do that) and call a callback function on each one
  element.addEventListener("click", deleteItem); // add an new event listener on each one that calls the deleteItem method
});

Array.from(item).forEach((element) => {
  // create an array from the incomplete items and call a callback function for each one
  element.addEventListener("click", markComplete); // add an event listener on each that calls the markComplete method
});

Array.from(itemCompleted).forEach((element) => {
  // create an array from the completed items and call a callback function for each one
  element.addEventListener("click", markUnComplete); // add an event listener on each that calls the markUnComplete method
});

async function deleteItem() {
  // declares an asynchronous function called deleteItem
  const itemText = this.parentNode.childNodes[1].innerText; // sets itemText to the text in the span of the item the button is next to
  try {
    const response = await fetch("deleteItem", {
      // sent a HTTP request to the "deleteItem route"
      method: "delete", // make it a delete request
      headers: { "Content-Type": "application/json" }, // set the headers to communicate that we are sending a JSON
      body: JSON.stringify({
        // turn the JS Object into a JSON string
        itemFromJS: itemText, // we are sending the itemText string
      }),
    });
    const data = await response.json(); // wait for the server to respond and parse the JSON it sends back to us
    console.log(data); // print whatever the server returns to us
    location.reload(); // reload the page
  } catch (err) {
    console.log(err); // print any errors to the console
  }
}

async function markComplete() {
  // declare an asynchronous function called markComplete
  const itemText = this.parentNode.childNodes[1].innerText; // grab the text in the span
  try {
    const response = await fetch("markComplete", {
      // send an HTTP request to the "markComplete" route
      method: "put", // set it as a put request
      headers: { "Content-Type": "application/json" }, // set the headers to communicate that we are sending JSON in the body
      body: JSON.stringify({
        // turn the JS object into a JSON string
        itemFromJS: itemText, // send the item text from the span
      }),
    });
    const data = await response.json(); // turn the response into a json
    console.log(data); // print the response
    location.reload(); // reload the page
  } catch (err) {
    console.log(err); // print any errors to the console
  }
}

async function markUnComplete() {
  // declare an asynchronous function called markUnComplete
  const itemText = this.parentNode.childNodes[1].innerText; // grab the text inside the span
  try {
    const response = await fetch("markUnComplete", {
      // send an HTTP request to the "markUnComplete" route
      method: "put", // set it as a put request
      headers: { "Content-Type": "application/json" }, // set the headers to communicate that we are sending JSON in the body
      body: JSON.stringify({
        // turn the JS object into a JSON string
        itemFromJS: itemText, // send the text from the span
      }),
    });
    const data = await response.json(); // turn the response from the server into a string
    console.log(data); // print the response to the console
    location.reload(); // reload the page
  } catch (err) {
    console.log(err); // print any errors to the console
  }
}
