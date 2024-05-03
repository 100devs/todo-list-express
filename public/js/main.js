const deleteBtn = document.querySelectorAll(".fa-trash"); //creating a variable and selecting all elements with a class of the trash can
const item = document.querySelectorAll(".item span"); //creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll(".item span.completed"); //creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element) => {
  //creating an array from our selection and starting a loop
  element.addEventListener("click", deleteItem); //add an event listener to the current item that waits for a click and then calls a function called deleteItem
}); //close our loop

Array.from(item).forEach((element) => {
  //creating an array from out selection and starting a loop
  element.addEventListener("click", markComplete); //add an event listener to the current item that waits for a click and then calls a function called markComplete
}); //close our loop

Array.from(itemCompleted).forEach((element) => {
  //creating an array from our selection and starting a loop
  element.addEventListener("click", markUnComplete); //adds an event listener to ONLY completed items
}); //close our loop

// Declaring an asynchronous function
async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText; // looks inside of the list item and grabs only the inner text within the text
  //starting a try block to do something
  try {
    // creates a response variable that waits on a fetch to get data from the result of deleteItem route
    const response = await fetch("deleteItem", {
      method: "delete", // sets the CRUD method for the route
      headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
      //declare the message content being passed, and stringify that content
      body: JSON.stringify({
        itemFromJS: itemText, //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
      }), //closing the body
    }); // closing the object
    const data = await response.json(); // waiting on JSON from the response to be converted
    console.log(data); // logs result to the console
    location.reload(); // reloads the page to update what is displayed
    // if an error occurs, pass the error into the catch block
  } catch (err) {
    console.log(err); // logs error to the console
  } //close the catch block
} // end the function

//Declaring an asynchronous function
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; // looks inside of the list item and grabs only the inner text within the text
  //Creating try block to do something
  try {
    // creates a response variable that waits on a fetch to get data from the result of markComplete route
    const response = await fetch("markComplete", {
      method: "put", // sets the CRUD method to "update" for the route
      headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
      // declare the message content being passed, and stringify that content
      body: JSON.stringify({
        itemFromJS: itemText, // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
      }), //closing the body
    }); //closing the object
    const data = await response.json(); // waiting on JSON from the response to be converted
    console.log(data); // log the result to the console
    location.reload(); // reloads the page to update what is displayed
    // if an error occurs, pass the error into the catch block
  } catch (err) {
    console.log(err); // logs error to the console
  } // close the catch block
} // end the function

//Declaring an asynchronous function
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; //looks inside of the list item and grabs only the inner text within the text
  //Creating a try block to do something
  try {
    // creates a response variable that waits on a fetch to get data from the result of markUnComplete route
    const response = await fetch("markUnComplete", {
      method: "put", //sets the CRUD method to "update" for he route
      headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
      //declare the message content being passed, and stringify that content
      body: JSON.stringify({
        itemFromJS: itemText, // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
      }), //closing the body
    }); //closing the object
    const data = await response.json(); // waiting on JSON from the response to be converted
    console.log(data); // log the result to the console
    location.reload(); // reloads the page to update what is displayed
    // if an error occurs, pass the error into the catch block
  } catch (err) {
    console.log(err); //logs error to the console
  } // close the catch block
} // end the function
