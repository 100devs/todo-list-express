const deleteBtn = document.querySelectorAll(".fa-trash"); //creates a variable (deleteBtn) and assigns it to all elements with a class of trashcan
const item = document.querySelectorAll(".item span"); //creates a variable (item) and assigns it to all span tags inside of a parent that has a class of item
const itemCompleted = document.querySelectorAll(".item span.completed"); //creates a variable (itemCompleted) and assigns it to all span tags with a class of completed inside of a parent that has a class of item

Array.from(deleteBtn).forEach((element) => {
  //creates an array from the deleteBtn variable and loops through each element
  element.addEventListener("click", deleteItem); //adds an event listener to each item that waits for a click that will call a function called deleteItem
});

Array.from(item).forEach((element) => {
  //creates an array form the item variable and loops through each element
  element.addEventListener("click", markComplete); //adds an event listener to each item that waits for a click that will call a function called markComplete
});

Array.from(itemCompleted).forEach((element) => {
  //creates an array form the itemCompleted variable and loops through each element
  element.addEventListener("click", markUnComplete); //adds an event listener to each item that waits for a click that will call a function called markUnComplete
});

async function deleteItem() {
  //declares an asychronous function
  const itemText = this.parentNode.childNodes[1].innerText; //looks inside of the list item to extract the inner text from the specified list span
  try {
    //starting a try block
    const response = await fetch("deleteItem", {
      //assigns a response variable that waits on a fetch to get data from the result of the /deleteItem route
      method: "delete", //sets the CRUD method for the route
      headers: { "Content-Type": "application/json" }, //specifies the type of content expected, which is JSON
      body: JSON.stringify({
        //declares content from the message we get from the request and turn it into a string
        itemFromJS: itemText, //setting the content of the body to the inner text of the list item and naming it itemFromJS
      }),
    });
    const data = await response.json(); //waiting on JSON from the response to be converted
    console.log(data); //logs the data to the console
    location.reload(); //refreshes the page to upate what is displayed
  } catch (err) {
    //if an error occurs, pass the error into the catch block
    console.log(err); //logs the error to the console
  }
}

//fires when an item from out todos is clicked and will make a PUT request to our server
async function markComplete() {
  //declares an asychronous function
  const itemText = this.parentNode.childNodes[1].innerText; //looks inside of the list item to extract the inner text from the specified list span
  try {
    // starting a try block
    const response = await fetch("markComplete", {
      //fetching the markComplete endpoint with a PUT method (update)
      method: "put", //makes a PUT request to our server and passes our itemText into the body of our request
      headers: { "Content-Type": "application/json" }, //specifies the type of content expected - JSON
      body: JSON.stringify({
        //declares content from the message we get from the request and turn it into a string
        itemFromJS: itemText, //setting the content of the body to the inner text of the list item and naming it itemFromJS
      }),
    });

    const data = await response.json(); //converts the response to JSON
    console.log(data); //logs the data to the console
    location.reload(); //refresh page - represents the current url
  } catch (err) {
    //if an error occurs, pass the error into the catch block
    console.log(err); //logs the error to the console
  }
}

async function markUnComplete() {
  //declares an asychronous function
  const itemText = this.parentNode.childNodes[1].innerText; //looks inside of the list item to extract the inner text from the specified list span
  try {
    const response = await fetch("markUnComplete", {
      //fetching the markComplete endpoint with a PUT method (update)
      method: "put", //makes a PUT request to our server and passes our itemText into the body of our request
      headers: { "Content-Type": "application/json" }, //specifies the type of content expected - JSON
      body: JSON.stringify({
        //declares content from the message we get from the request and turn it into a string
        itemFromJS: itemText, //setting the content of the body to the inner text of the list item and naming it itemFromJS
      }),
    });

    const data = await response.json(); //converts the response to JSON
    console.log(data); //logs the data to the console
    location.reload(); //refreshes the page to upate what is displayed
  } catch (err) {
    //if an error occurs, pass the error into the catch block
    console.log(err); //logs the error to the console
  }
}
