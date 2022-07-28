//creating a variable and assigning it to a selection of all elements with a class of the trash can
const deleteBtn = document.querySelectorAll(".fa-trash");

// creating a variable and assigning it to a selection of span tags inside of a partent that has a class of "item"
const item = document.querySelectorAll(".item span");
// creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"
const itemCompleted = document.querySelectorAll(".item span.completed");

// creating an array from our selection and starting a loop
Array.from(deleteBtn).forEach((element) => {
  // add an event listener to the current item that waits for a click and then calls a function called deleteItem
  element.addEventListener("click", deleteItem);
}); //close our loop

// creating an array from our selection and starting a loop
Array.from(item).forEach((element) => {
  // add an event listener to the current item that waits for a click and then calls a function called markComplete
  element.addEventListener("click", markComplete);
}); //close our loop

// creating an array from our selection and starting a loop
Array.from(itemCompleted).forEach((element) => {
  // add an event listener to ONLY completed items
  element.addEventListener("click", markUnComplete);
}); //close our loop

// declare asynchronous function
async function deleteItem() {
  //looks inside of the list item and grabs only the inner text within the span. Remember that childNodes are counted [1], [3], [5], etc
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // starting a try block to do something

    //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
    const response = await fetch("deleteItem", {
      method: "delete", //sets the CRUD for the "delete" route
      headers: { "Content-Type": "application/json" }, //specifying the type of content expected, which is JSON
      body: JSON.stringify({
        //declare the message content being passed, and stringify that content
        itemFromJS: itemText, //setting the content of the body to the inner text of the list item, and making it 'itemFromJS'
      }), //closing the body
    }); //closing the object
    const data = await response.json(); //waiting on JSON from the response to be converted
    console.log(data); //log the result to the console
    location.reload(); //reloads the page to update what is displayed
  } catch (err) {
    //if an error occurs, pass the error into the catch block
    console.log(err); //log the error to the console
  } //close catch block
} //end the function

// declare an asynchronous function
async function markComplete() {
  //looks inside of the list item and grabs only the inner text within the span. Remember that childNodes are counted [1], [3], [5], etc
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // starting a try block to do something

    //creates a response variable that waits on a fetch to get data from the result of the markComplete route
    const response = await fetch("markComplete", {
      method: "put", //sets the CRUD method to "update" for the route
      headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
      body: JSON.stringify({
        itemFromJS: itemText, // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
      }),
    });
    const data = await response.json(); // waiting on JSON from the response to be converted
    console.log(data); //log the result to the console
    location.reload(); //reloads the page to update what is displayed
  } catch (err) {
    //if an error occurs, pass the error into the catch block
    console.log(err); //log the error to the console
  } //close catch block
} // end the function

// declare an asynchronous function
async function markUnComplete() {
  //looks inside of the list item and grabs only the inner text within the span. Remember that childNodes are counted [1], [3], [5], etc
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // starting a try block to do something

    //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
    const response = await fetch("markUnComplete", {
      method: "put", //sets the CRUD method to "update" for the route
      headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
      body: JSON.stringify({
        itemFromJS: itemText, // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
      }), //close catch block
    }); // end the function
    const data = await response.json(); // waiting on JSON from the response to be converted
    console.log(data); //log the error to the console
    location.reload(); //reloads the page to update what is displayed
  } catch (err) {
    //if an error occurs, pass the error into the catch block
    console.log(err); //log the error to the console
  } //close catch block
} // end the function
