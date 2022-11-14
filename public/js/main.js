const deleteBtn = document.querySelectorAll(".fa-trash"); // create a variable and assing all the elements with fa-trash class
const item = document.querySelectorAll(".item span"); // create a variable and assing all the span elements inside elements  with item class
const itemCompleted = document.querySelectorAll(".item span.completed"); // create a variable and assing all span elements with a clas of completed inisde an element with class of item
Array.from(deleteBtn).forEach((element) => {
  // create a loop from an array created from nodes from deleBtn variable
  element.addEventListener("click", deleteItem); // add an event listener for every element, with a click event that calls deleteItem funcition
}); // close loop

Array.from(item).forEach((element) => {
  // create a loop from an array created from nodes from item variable
  element.addEventListener("click", markComplete); // add an event listener for every element, with a click event that calls markComplete funcition
}); // close loop

Array.from(itemCompleted).forEach((element) => {
  // create a loop from an array created from nodes from itemCompleted variable
  element.addEventListener("click", markUnComplete); // add an event listener for every element, with a click event that calls markUncomplete funcition
}); // close loop

async function deleteItem() {
  c;
  const itemText = this.parentNode.childNodes[1].innerText; // declare a variable and asign it the content from the second element of the child node from the parent node of the selected element selected, in this case the content of the text of the selected item
  try {
    // start a try block to do something
    const response = await fetch("deleteItem", {
      // declare a variable that waits on a fetch to get data from the result of deleteItem and strat an object
      method: "delete", // sets method DELETE for the route
      headers: { "Content-Type": "application/json" }, // specify th etype of expected content, JSON
      body: JSON.stringify({
        // declare a message content beig passed, and making it into a string
        itemFromJS: itemText, // setting the content of the body to the inner tet of the list item and namig it 'itemFromJS'
      }), // close the body
    }); // close object
    const data = await response.json(); // wait the server to respond with json
    console.log(data); // print to the consle the data from server
    location.reload(); // reloads the page to update what is displayed
  } catch (err) {
    // start a catch block that passes the error
    console.log(err); // print error
  } // close catch block
} // end of function

async function markComplete() {
  // declaring an asychronous function call markcomplete
  const itemText = this.parentNode.childNodes[1].innerText; // declare a variable and asign it the content from the second element of the child node from the parent node of the selected element selected, in this case the content of the text of the selected item
  try {
    // start a try block to do something
    const response = await fetch("markComplete", {
      // declare a variable that waits on a fetch to get data from the result of markComplete and strat an object
      method: "put", // sets method PUT for the route
      headers: { "Content-Type": "application/json" }, // specify the type of expected content, JSON
      body: JSON.stringify({
        // declare a message content beig passed, and making it into a string
        itemFromJS: itemText, // setting the content of the body to the inner tet of the list item and namig it 'itemFromJS
      }), // close the body
    }); // close object
    const data = await response.json(); // wait the server to respond with json
    console.log(data); // print to the consle the data from server
    location.reload(); // reloads the page to update what is displayed
  } catch (err) {
    // start a catch block that passes the error
    console.log(err); // print error
  } // close catch block
} // end of function

async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markUnComplete", {
      method: "put", // sets method PUT for the route
      headers: { "Content-Type": "application/json" }, // specify the type of expected content, JSON
      body: JSON.stringify({
        // declare a message content beig passed, and making it into a string
        itemFromJS: itemText, // setting the content of the body to the inner tet of the list item and namig it 'itemFromJS
      }), // close the body
    }); // close object
    const data = await response.json(); // wait the server to respond with json
    console.log(data); // print to the consle the data from server
    location.reload(); // reloads the page to update what is displayed
  } catch (err) {
    // start a catch block that passes the error
    console.log(err); // print error
  } // close catch block
} // end of function
