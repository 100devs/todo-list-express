const deleteBtn = document.querySelectorAll(".fa-trash"); //Creating a variable and assigning it all elements with a class of fa-trash
const item = document.querySelectorAll(".item span"); //Creating a variable and assigning it all span elements with a parent that has class of item
const itemCompleted = document.querySelectorAll(".item span.completed"); //Creating a variable and assigning it all span elements with class completed and a parent with class item

Array.from(deleteBtn).forEach((element) => {
  //Creating an array of all the delete buttons and looping through each element
  element.addEventListener("click", deleteItem); //Adding an event listener to each element that will call the deleteItem function on click
}); //Closing loop

Array.from(item).forEach((element) => {
  //Creating an array of all the uncompleted items and looping through each element
  element.addEventListener("click", markComplete); //Adding an event listener to each element that will call the markComplete function on click
}); //Closing loop

Array.from(itemCompleted).forEach((element) => {
  //Creating an array of all the completed items and looping through each element
  element.addEventListener("click", markUnComplete); //Adding an event listener to each element that will call the markUnComplete function on click
}); //Closing loop

async function deleteItem() {
  //Declaring the asynchronous function
  const itemText = this.parentNode.childNodes[1].innerText; //Looks inside of the list item to extract the inner text within the list span
  try {
    //Starting a try block
    const response = await fetch("deleteItem", {
      //Creating a variable that waits on a fetch to get data from the results of the deleteItem route
      method: "delete", //Setting the CRUD method of the route
      headers: { "Content-Type": "application/json" }, //Specifying the type of content expected, which is JSON
      body: JSON.stringify({
        //Declaring the message content being passed, and stringify the content
        itemFromJS: itemText, //Setting the content of the body to the inner text of the list item, and naming it itemFromJS
      }), //Closing body
    }); //Closing the object
    const data = await response.json(); //Waiting on JSON from the response to be converted
    console.log(data); //Logging data to console
    location.reload(); //Reloading page to update what is displayed
  } catch (err) {
    //If an error occurs, pass the error into the catch block
    console.log(err); //Log the error to the console
  } //Close the catch block
} //End the function

async function markComplete() {
  //Declaring the asynchronous function
  const itemText = this.parentNode.childNodes[1].innerText; //Looks inside of the list item to extract the inner text within the list span
  try {
    //Starting a try block
    const response = await fetch("markComplete", {
      //Creating a variable that waits on a fetch to get data from the results of the markComplete route
      method: "put", //Setting the CRUD method of the route
      headers: { "Content-Type": "application/json" }, //Specifying the type of content expected, which is JSON
      body: JSON.stringify({
        //Declaring the message content being passed, and stringify the content
        itemFromJS: itemText, //Setting the content of the body to the inner text of the list item, and naming it itemFromJS
      }), //Closing body
    }); //Closing the object
    const data = await response.json(); //Waiting on JSON from the response to be converted
    console.log(data); //Logging data to console
    location.reload(); //Reloading page to update what is displayed
  } catch (err) {
    //If an error occurs, pass the error into the catch block
    console.log(err); //Log the error to the console
  } //Close the catch block
} //End the function

async function markUnComplete() {
  //Declaring the asynchronous function
  const itemText = this.parentNode.childNodes[1].innerText; //Looks inside of the list item to extract the inner text within the list span
  try {
    //Starting a try block
    const response = await fetch("markUnComplete", {
      //Creating a variable that waits on a fetch to get data from the results of the markUnComplete route
      method: "put", //Setting the CRUD method of the route
      headers: { "Content-Type": "application/json" }, //Specifying the type of content expected, which is JSON
      body: JSON.stringify({
        //Declaring the message content being passed, and stringify the content
        itemFromJS: itemText, //Setting the content of the body to the inner text of the list item, and naming it itemFromJS
      }), //Closing body
    }); //Closing the object
    const data = await response.json(); //Waiting on JSON from the response to be converted
    console.log(data); //Logging data to console
    location.reload(); //Reloading page to update what is displayed
  } catch (err) {
    //If an error occurs, pass the error into the catch block
    console.log(err); //Log the error to the console
  } //Close the catch block
} //End the function
