//Creating a constant variable and assigning it to a selection of all elements with the class of fa-trash
const deleteBtn = document.querySelectorAll(".fa-trash");
//Creating a constant variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const item = document.querySelectorAll(".item span");
//Creating a constant variable and assigning it to a selection of spans with the class of "completed" inside of a parent with a class of "item"
const itemCompleted = document.querySelectorAll(".item span.completed");

//Creating an array from our selection starting a loop.
Array.from(deleteBtn).forEach((element) => {
  //Add an event listener to the current item that waits for a click. Once a click is heard it calls the deleteItem function.
  element.addEventListener("click", deleteItem);
}); //Close loop

//Creating an array from our selection and starting a loop
Array.from(item).forEach((element) => {
  //Add an event listener to the current item that waits for a click. Once a click is heard it calls the markComplete function.
  element.addEventListener("click", markComplete);
});

//Creating an array from our selection and starts a loop
Array.from(itemCompleted).forEach((element) => {
  //Adds an event listener to only completed items
  element.addEventListener("click", markUnComplete);
}); //Closes the loop

//Declares an async function
async function deleteItem() {
  //Looks inside of the list item and only grabs the inner text within the list span
  const itemText = this.parentNode.childNodes[1].innerText;
  //Declares a try block
  try {
    //Creating a constant variable that waits on a fetch to get data from the result of deleteItem route
    const response = await fetch("deleteItem", {
      //Sets the CRUD method for the route
      method: "delete",
      //Specifying the type of content expected, which is JSON
      headers: { "Content-Type": "application/json" },
      //Declare the message content being passed and stringify that content
      body: JSON.stringify({
        //Setting the content of the body to the inner text of the list item and naming it itemFromJS
        itemFromJS: itemText,
        //Closing the body
      }),
      //Closing the object
    });
    //Declares a constant variable that waits for JSON from the response to be converted
    const data = await response.json();
    //Logs the data to the console
    console.log(data);
    //Refreshes the page to update the DOM
    location.reload();
    //If an error occurs pass the error into the catch block
  } catch (err) {
    //Log the error to the console
    console.log(err);
    //Close the catch block
  }
  //End the function
}
//Declare an async function
async function markComplete() {
  //Looks inside of the list item and only grabs the inner text within the list span
  const itemText = this.parentNode.childNodes[1].innerText;
  //Declares a try block
  try {
    //Creating a constant variable that waits on a fetch to get data from the result of markComplete route
    const response = await fetch("markComplete", {
      //Setting the CRUD method to update for the route
      method: "put",
      //Specifying the type of content expected, which is JSON
      headers: { "Content-Type": "application/json" },
      //Declare the message content being passed and stringify that content
      body: JSON.stringify({
        //Setting the content of the body to the inner text of the list item and naming it itemFromJS
        itemFromJS: itemText,
        //Closing the body
      }),
      //Closing the object
    });
    //Declares a constant variable that waits for JSON from the response to be converted
    const data = await response.json();
    //Log the data to the console
    console.log(data);
    //Refreshes the page to update the DOM
    location.reload();
    //If an error occurs pass the error into the catch block
  } catch (err) {
    //Log the error to the console
    console.log(err);
    //Close the catch block
  }
  //End the function
}

//Declare an async function
async function markUnComplete() {
  //Looks inside of the list item and only grabs the inner text within the list span
  const itemText = this.parentNode.childNodes[1].innerText;
  //Declare a try block
  try {
    //Creating a constant variable that waits on a fetch to get data from the result of markUnComplete route
    const response = await fetch("markUnComplete", {
      //Setting the CRUD method to update for the route
      method: "put",
      //Specifying the type of content expected, which is JSON
      headers: { "Content-Type": "application/json" },
      //Declare the message content being passed and stringify that content
      body: JSON.stringify({
        //Setting the content of the body to the inner text of the list item and naming it itemFromJS
        itemFromJS: itemText,
        //Closing the body
      }),
      //Closing the object
    });
    //Declares a constant variable that waits for JSON from the response to be converted
    const data = await response.json();
    //Log the data to the console
    console.log(data);
    //Refreshes the page to update the DOM
    location.reload();
    //If an error occurs pass the error into the catch block
  } catch (err) {
    //Log the error to the console
    console.log(err);
    //Close the catch block
  }
  //Ends the function
}
