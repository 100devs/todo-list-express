// Client side JavaScript

const deleteBtn = document.querySelectorAll('.fa-trash'); // Creating a variable and assigning to all elements with a class of 'fa-trashcan'
const item = document.querySelectorAll('.item span'); // Creating a variable and assigning to all span elements that has a parent with a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed'); // Creating a variable and assigning to all span elements with a class of 'completed' inside a parent with 'item' class

// Looping through the array of deleteBtn elements and adding and event listener that calls the deleteItem function when a 'click' happen on clicked element
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

// Looping through the array of item elements and adding and event listener that calls the markComplete function when a 'click' happen on clicked element
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

// Looping through the array of itemCompleted elements and adding and event listener that calls the markUnComplete function when a 'click' happen only on completed items
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// declare an asynchronous function
async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText; // selecting the text of the clicked element and assign it to a variable. Element hears the click -> It goes to the parent <li> -> and select the text of the first span inside the <li>
  try {
    // If no error this block is executed
    const response = await fetch('deleteItem', {
      // creates a response variable that waits for a fetch to resolve and get data from the result of deleteItem
      method: 'delete', // CRUD method to send the request to the server
      headers: { 'Content-Type': 'application/json' }, // Inform the server the format of the data to receive
      // declare the message content being passed and convert the JavaScript value to JSON string (JSON.stringify)
      body: JSON.stringify({
        itemFromJS: itemText // setting the content of the body as a property named 'itemFromJs' as the inner text of itemText
      }) // closing body
    }); // closing object
    const data = await response.json(); // waiting on JSON from the response to be parsed as JavaScript
    console.log(data); // log result to the console
    location.reload(); // Reloading site
  } catch (err) {
    // if an error occurs, pass the error into the catch block
    console.log(err); // log error
  }
}

// declare asynchronous function
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; // selecting the text of the clicked element and assign it to a variable.  Element hears the click -> It goes to the parent <li> -> and select the text of the first span inside the <li>
  try {
    // If no error this block is executed
    const response = await fetch('markComplete', {
      // creates a response variable that waits for a fetch to resolve and get data from the result of markComplete
      method: 'put', // CRUD method to send the request to the server (update)
      headers: { 'Content-Type': 'application/json' }, // Inform the server the format of the data to receive
      // declare the message content being passed and convert the JavaScript value to JSON string (JSON.stringify)
      body: JSON.stringify({
        // setting the content of the body as a property named 'itemFromJS' as the inner text of itemText
        itemFromJS: itemText
      })
    });
    const data = await response.json(); // waiting on JSON from the response to be parsed as JavaScript
    console.log(data); // log result to the console
    location.reload(); // Reloading site
  } catch (err) {
    // if an error occurs, pass the error into the catch block
    console.log(err); // log error
  }
}

// declare asynchronous function
async function markUnComplete() {
  // selecting the text of the clicked element and assign it to a variable.  Element hears the click -> It goes to the parent <li> -> and select the text of the first span inside the <li>
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // If no error this block is executed
    const response = await fetch('markUnComplete', {
      // creates a response variable that waits for a fetch to resolve and get data from the result of markUncomplete
      method: 'put', // CRUD method to send the request to the server (update)
      headers: { 'Content-Type': 'application/json' }, // Inform the server the format of the data to receive
      body: JSON.stringify({
        // setting the content of the body as a property named 'itemFromJS' as the inner text of itemText
        itemFromJS: itemText
      })
    });
    const data = await response.json(); // waiting on JSON from the response to be parsed as JavaScript
    console.log(data); // log result to the console
    location.reload(); // Reloading site
  } catch (err) {
    // if an error occurs, pass the error into the catch block
    console.log(err); // log error
  }
}
