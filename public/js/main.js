// Set variable equal to all elements with the .fa-trash class
const deleteBtn = document.querySelectorAll('.fa-trash');
// Set variable equal to all elements with the .item class and span tag
const item = document.querySelectorAll('.item span');
// Set variable equal to all elements with the .item class and span.completed class
const itemCompleted = document.querySelectorAll('.item span.completed');

// Create array from deleteBtn elements and then iterate thru the array once
Array.from(deleteBtn).forEach((element) => {
  // add an event listener to each element in the array that will fire when the element is clicked and run the deleteItem function
  element.addEventListener('click', deleteItem);
});

// Create array from item elements and then iterate thru the array once
Array.from(item).forEach((element) => {
  // add an event listener to each element in the array that will fire when the element is clicked and run the markComplete function
  element.addEventListener('click', markComplete);
});

// Create array from itemCompleted elements and then iterate thru the array once
Array.from(itemCompleted).forEach((element) => {
  // add an event listener to each element in the array that will fire when the element is clicked and run the markUnComplete function
  element.addEventListener('click', markUnComplete);
});

// Define a asynchronous deleteItem function with no parameters
async function deleteItem() {
  // create variable with a value of the inner text from a sibling element to the element that was clicked on
  const itemText = this.parentNode.childNodes[1].innerText;
  //   start try catch block (try to do some code and if it throws errors catch them)
  try {
    // set response variable with a value of what the asynchronous fetch function returns, the first argument is the resource or URL you want to fetch from
    const response = await fetch('deleteItem', {
      // HTTP request type of DELETE
      method: 'delete',
      //   Saying that we are sending content as JSON
      headers: { 'Content-Type': 'application/json' },
      //   Setting the body and converting it to JSON
      body: JSON.stringify({
        // key value pair and setting itemFromJS with a value of the itemText from the html document
        itemFromJS: itemText,
      }),
    });
    // Setting a variable data equal to the response converted to JSON
    const data = await response.json();
    // Log the data to the console in the browser
    console.log(data);
    // Refresh the current page (this will allow the deleted item to disappear)
    location.reload();
    // Catch errors if the try block isn't successful
  } catch (err) {
    // Log those errors to the browsers console.
    console.log(err);
  }
}

// Define a asynchronous markComplete function with no parameters
async function markComplete() {
  // create variable with a value of the inner text from a sibling element to the element that was clicked on
  const itemText = this.parentNode.childNodes[1].innerText;
  //   start try catch block (try to do some code and if it throws errors catch them)
  try {
    // set response variable with a value of what the asynchronous fetch function returns, the first argument is the resource or URL you want to fetch from
    const response = await fetch('markComplete', {
      // HTTP request type of PUT
      method: 'put',
      //   Saying that we are sending content as JSON
      headers: { 'Content-Type': 'application/json' },
      //   Setting the body and converting it to JSON
      body: JSON.stringify({
        // key value pair and setting itemFromJS with a value of the itemText from the html document
        itemFromJS: itemText,
      }),
    });
    // Setting a variable data equal to the response converted to JSON
    const data = await response.json();
    // Log the data to the console in the browser
    console.log(data);
    // Refresh the current page (this will allow the deleted item to disappear)
    location.reload();
    // Catch errors if the try block isn't successful
  } catch (err) {
    // Log those errors to the browsers console.
    console.log(err);
  }
}

// Define a asynchronous markUnComplete function with no parameters
async function markUnComplete() {
  // create variable with a value of the inner text from a sibling element to the element that was clicked on
  const itemText = this.parentNode.childNodes[1].innerText;
  //   start try catch block (try to do some code and if it throws errors catch them)
  try {
    // set response variable with a value of what the asynchronous fetch function returns, the first argument is the resource or URL you want to fetch from
    const response = await fetch('markUnComplete', {
      // HTTP request type of PUT
      method: 'put',
      //   Saying that we are sending content as JSON
      headers: { 'Content-Type': 'application/json' },
      //   Setting the body and converting it to JSON
      body: JSON.stringify({
        // key value pair and setting itemFromJS with a value of the itemText from the html document
        itemFromJS: itemText,
      }),
    });
    // Setting a variable data equal to the response converted to JSON
    const data = await response.json();
    // Log the data to the console in the browser
    console.log(data);
    // Refresh the current page (this will allow the deleted item to disappear)
    location.reload();
    // Catch errors if the try block isn't successful
  } catch (err) {
    // Log those errors to the browsers console.
    console.log(err);
  }
}
