// hold elements with a class of fa-trash with deleteBtn variable
const deleteBtn = document.querySelectorAll(".fa-trash");
// hold span elements that found inside a parent has class of 'item' with item variable
const item = document.querySelectorAll(".item span");
// hold span elements that has class 'completed' and that found inside a parent has class of 'item' with itemCompleted variable
const itemCompleted = document.querySelectorAll(".item span.completed");

// create array from the iterable variable deleteBtn
// loop through them
// add event listener for each element listen for 'click' when it catched fire a deleteItem function
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// create array from the iterable variable item
// loop through them
// add event listener for each element listen for 'click' when it catched fire a markComplete function
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// create array from the iterable variable itemCompleted
// loop through them
// add event listener for each element listen for 'click' when it catched fire a markUnComplete function
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// definition of deleteItem function that will used for deletion and make it async as it will deals with the server that will take time to fulfilled
async function deleteItem() {
  // store 'this' which hold the clicked item's parent's first child's text in itemText variable
  // 'this': span.fa.fa-trash
  // 'parentNode' : li.item
  // 'childNodes[1]': [text, *span*, text, text,span.fa.fa-trash, text]
  // 'innerText': the text of the above selected span
  const itemText = this.parentNode.childNodes[1].innerText;
  // use try catch mechanism that will catch any errors if code in try not work correctly and generate error
  try {
    // save the response from calling the deleteItem route in the server in response variable
    const response = await fetch("deleteItem", {
      // the method of http protocol 
      method: "delete",
      // header of the request tells the server that the expected content is in json format
      headers: { "Content-Type": "application/json" },
      // encode the body content (the data passed to the server with the request method) to json format
      body: JSON.stringify({
        // the data will be passed it the itemText variable which it is the text of the todo item and will be accessed in the server as: request.body.itemFromJS
        itemFromJS: itemText,
      }),
    });
    // use await as it may take time to solve the fetch method and convert the data received from the server as the response to json format that we could use it in the frontend
    const data = await response.json();
    // show the data variable in the console
    console.log(data);
    // refresh the page so it will update the deletion action and we actually send another request to the server with the route '/' which will recalculate the data received from the database then update the screen with new data the will not include the deleted item
    location.reload();
  } catch (err) { // catch part that will be affected if there is an error inside the try block
    // show the catched error in the console
    console.log(err);
  }
}

// definition of markComplete function that will used for make a clicked item complete if it is incomplete and make it async as it will deals with the server that will take time to fulfilled
async function markComplete() {
  // store 'this' which hold the clicked item's parent's first child's text in itemText variable
  // 'this': span.fa.fa-trash
  // 'parentNode' : li.item
  // 'childNodes[1]': [text, *span*, text, text,span.fa.fa-trash, text]
  // 'innerText': the text of the above selected span
  const itemText = this.parentNode.childNodes[1].innerText;
  // use try catch mechanism that will catch any errors if code in try not work correctly and generate error
  try {
    // save the response from calling the markComplete route in the server in response variable
    const response = await fetch("markComplete", {
      // the method of http protocol 
      method: "put",
      // header of the request tells the server that the expected content is in json format
      headers: { "Content-Type": "application/json" },
      // encode the body content (the data passed to the server with the request method) to json format
      body: JSON.stringify({
        // the data will be passed it the itemText variable which it is the text of the todo item and will be accessed in the server as: request.body.itemFromJS
        itemFromJS: itemText,
      }),
    });
    // use await as it may take time to solve the fetch method and convert the data received from the server as the response to json format that we could use it in the frontend
    const data = await response.json();
    // show the data variable in the console
    console.log(data);
    // refresh the page so it will update the deletion action and we actually send another request to the server with the route '/' which will recalculate the data received from the database then update the screen with new data the will not include the deleted item
    location.reload();
  } catch (err) { // catch part that will be affected if there is an error inside the try block
    // show the catched error in the console
    console.log(err);
  }
}

// definition of markUnComplete function that will used for make a clicked item incomplete if it is complete and make it async as it will deals with the server that will take time to fulfilled
async function markUnComplete() {
  // store 'this' which hold the clicked item's parent's first child's text in itemText variable
  // 'this': span.fa.fa-trash
  // 'parentNode' : li.item
  // 'childNodes[1]': [text, *span*, text, text,span.fa.fa-trash, text]
  // 'innerText': the text of the above selected span
  const itemText = this.parentNode.childNodes[1].innerText;
  // use try catch mechanism that will catch any errors if code in try not work correctly and generate error
  try {
    // save the response from calling the markUnComplete route in the server in response variable
    const response = await fetch("markUnComplete", {
      // the method of http protocol 
      method: "put",
      // header of the request tells the server that the expected content is in json format
      headers: { "Content-Type": "application/json" },
      // encode the body content (the data passed to the server with the request method) to json format
      body: JSON.stringify({
        // the data will be passed it the itemText variable which it is the text of the todo item and will be accessed in the server as: request.body.itemFromJS
        itemFromJS: itemText,
      }),
    });
    // use await as it may take time to solve the fetch method and convert the data received from the server as the response to json format that we could use it in the frontend
    const data = await response.json();
    // show the data variable in the console
    console.log(data);
    // refresh the page so it will update the deletion action and we actually send another request to the server with the route '/' which will recalculate the data received from the database then update the screen with new data the will not include the deleted item
    location.reload();
  } catch (err) { // catch part that will be affected if there is an error inside the try block
    // show the catched error in the console
    console.log(err);
  }
}
