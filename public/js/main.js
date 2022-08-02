//declaring constant variables
const deleteBtn = document.querySelectorAll(".fa-trash"); //create contant variable and assigning all elements with a class of the trash can
const item = document.querySelectorAll(".item span"); //creating variable and assigning it to a selection of all spans insde a parent with class of item
const itemCompleted = document.querySelectorAll(".item span.completed"); //creating variable and assigning it to a selection of spans wth class of "completed" that are in a parent with class of "items"

//
Array.from(deleteBtn).forEach((element) => {
  //creating an array from our selection and starting a loop
  element.addEventListener("click", deleteItem); //during each iteration adding an event listener to the current item and listening for a 'click', once click, calls a function called deleteItem
}); //closes our loop

Array.from(item).forEach((element) => {
  //creating an array and starting a loop
  element.addEventListener("click", markComplete); ///during each iteration adding an event listener to the current item and listening for a 'click', once click, calls a function called markedComplete
}); //close our loop

Array.from(itemCompleted).forEach((element) => {
  //creating array and starting a loop
  element.addEventListener("click", markUnComplete); //adds event listener to ONLY completed items
});

async function deleteItem() {
  //declaring an asynchronrous function for deleteItem
  const itemText = this.parentNode.childNodes[1].innerText; //looks inside of the list item and grabs only the inner text within the list span
  try {
    //declaring a try block to do something
    const response = await fetch("deleteItem", {
      //creates variable that waits on a fetch to retrieve data from the result of deleteItem route
      method: "delete", // setss the CRUD method for the route
      headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
      body: JSON.stringify({
        //declare the message content being passed and stringify that content
        itemFromJS: itemText, // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
      }), //closing the body
    }); //closing the object
    const data = await response.json(); //waiting on JSON from the response to be converted
    console.log(data); //logs data to console
    location.reload(); //reloads page to update what is displayed
  } catch (err) {
    //declares catch block to catch an error if try does not work
    console.log(err); //logs error to console
  } //closes catch block
} //closes function

async function markComplete() {
  //declare an asynchonous function
  const itemText = this.parentNode.childNodes[1].innerText; //looks inside of the list item and grabs only the inner text within the list span
  try {
    //starting a try block to do something
    const response = await fetch("markComplete", {
      //creates variable that wait on a fetch to retrieve data from the result of markComplete route
      method: "put", //setting the CRUD method to "update" for the route
      headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
      body: JSON.stringify({
        //declare the message content being passed and stringify that content
        itemFromJS: itemText, // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
      }), //closes the body
    }); //closes the object
    const data = await response.json(); //waiting on JSON from the response to be converted
    console.log(data); //logs data to console
    location.reload(); //reloads page to update what is displayed
  } catch (err) {
    //declares catch block to catch an error if try does not work
    console.log(err); //logs error to console
  } //closes catch block
} //ends function

async function markUnComplete() {
  //declare asynchonous function
  const itemText = this.parentNode.childNodes[1].innerText; //looks inside of the list item and grabs only the inner text within the list span
  try {
    //starting a try block to do something
    const response = await fetch("markUnComplete", {
      //creates variable that waits on a fetch to retrieve data from the result of markUnComplete route
      method: "put", //setting the CRUD method to "update" for the route
      headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
      body: JSON.stringify({
        ////declare the message content being passed and stringify that content
        itemFromJS: itemText, // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
      }), //closes body
    }); //closes object
    const data = await response.json(); //waiting on JSON from the response to be converted
    console.log(data); //logs data to console
    location.reload(); //reloads page to update what is displayed
  } catch (err) {
    //declares catch block to catch an error if try does not work
    console.log(err); //logs error to console
  } //closes catch block
} //end function
