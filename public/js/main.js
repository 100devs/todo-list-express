const deleteBtn = document.querySelectorAll('.fa-trash'); // grabs collection of elements with .fa-trash class and stores in var Used to send delete request to the server
const item = document.querySelectorAll('.item span'); // grabs collection of elements from dom with .item span class Will be used to send an update request to server
const itemCompleted = document.querySelectorAll('.item span.completed'); // grabs collection of elements from dom with .item span.completed class Will be used to send an update request to server

Array.from(deleteBtn).forEach((element) => {
  // creates an array from collection of elements For each element an click event listener When clicked the deleteItem function will fire
  element.addEventListener('click', deleteItem);
});

Array.from(item).forEach((element) => {
  // creates an array from collection of elements For each element an click event listener When clicked the markComplete function will fire
  element.addEventListener('click', markComplete);
});

Array.from(itemCompleted).forEach((element) => {
  // creates an array from collection of elements For each element an click event listener When clicked the markUncomplete function will fire
  element.addEventListener('click', markUnComplete);
});

// function to delete todo
async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText; // this represents the element clicked on Goes to its parent node and accesses the second item in the childNodes array for its innerText
  try {
    // fetch request to delete an item Sent to /deleteItem endpoint
    const response = await fetch('deleteItem', {
      method: 'delete', // states http method
      headers: { 'Content-Type': 'application/json' }, // sets headers for response nad data expected sent and returned
      body: JSON.stringify({
        // converts data to json
        itemFromJS: itemText, //innerText from element clicked on
      }),
    });
    const data = await response.json(); // returns promise and extracts data from response
    console.log(data); // logs extracted data
    location.reload(); // refreshes the page to create a new get request to server and render the page with current data
  } catch (err) {
    // catches possible errors
    console.log(err); // logs error
  }
}

// function top update a todo as completed
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; // this represents the element clicked on Goes to its parent node and accesses the second item in the childNodes array for its innerText
  try {
    // fetch request to update an item Sent to /markComplete endpoint
    const response = await fetch('markComplete', {
      method: 'put', // states http method
      headers: { 'Content-Type': 'application/json' }, // sets headers for response nad data expected sent and returned
      body: JSON.stringify({
        // converts data to json
        itemFromJS: itemText, //innerText from element clicked on
      }),
    });
    const data = await response.json(); // returns promise and extracts data from response
    console.log(data); // logs extracted data
    location.reload(); // refreshes the page to create a new get request to server and render the page with current data
  } catch (err) {
    // catches possible errors
    console.log(err); // logs error
  }
}

async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; // this represents the element clicked on Goes to its parent node and accesses the second item in the childNodes array for its innerText
  try {
    // fetch request to update an item Sent to /markUnComplete endpoint
    const response = await fetch('markUnComplete', {
      method: 'put', // states http method
      headers: { 'Content-Type': 'application/json' }, // sets headers for response nad data expected sent and returned
      body: JSON.stringify({
        // converts data to json
        itemFromJS: itemText, //innerText from element clicked on
      }),
    });
    const data = await response.json(); // returns promise and extracts data from response
    console.log(data); // logs extracted data
    location.reload(); // refreshes the page to create a new get request to server and render the page with current data
  } catch (err) {
    // catches possible errors
    console.log(err); // logs error
  }
}
