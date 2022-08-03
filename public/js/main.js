const deleteBtn = document.querySelectorAll('.fa-trash'); // create a reference to all the item delete buttons
const item = document.querySelectorAll('.item span'); // create a reference to all the list items
const itemCompleted = document.querySelectorAll('.item span.completed'); // create a reference to all the completed items

Array.from(deleteBtn).forEach((element) => {
  // loop through the delete buttons and add a click event listener to each one
  element.addEventListener('click', deleteItem); // adds event listener
});

Array.from(item).forEach((element) => {
  // loop through the list items and add a click event listener to each one
  element.addEventListener('click', markComplete); // adds event listener
});

Array.from(itemCompleted).forEach((element) => {
  // loop through the completed items and add a click event listener to each one
  element.addEventListener('click', markIncomplete); // adds event listener
});

// delete item function
async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText; // get the text of the item to be deleted
  try {
    // try to delete the item
    const response = await fetch('deleteItem', {
      // fetch the delete item route
      method: 'delete', // set the method to delete
      headers: { 'Content-Type': 'application/json' }, // set the content type to json
      body: JSON.stringify({
        // set the body to the item text
        itemFromJS: itemText, // set the body to the item text
      }),
    });
    const data = await response.json(); // get the response data
    console.log(data); // log the data
    location.reload(); // reload the page
  } catch (err) {
    // catch any errors
    console.log(err); // log the error
  }
}

// function to mark an item as complete
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; // get the text of the item to be completed
  try {
    // try to complete the item
    const response = await fetch('markComplete', {
      // fetch the complete item route
      method: 'put', // set the method to put
      headers: { 'Content-Type': 'application/json' }, // set the content type to json
      body: JSON.stringify({
        // set the body to the item text
        itemFromJS: itemText, // set the body to the item text
      }),
    });
    const data = await response.json(); // get the response data
    console.log(data); // log the data
    location.reload(); // reload the page
  } catch (err) {
    // catch any errors
    console.log(err); // log the error
  }
}

// function to mark an item as incomplete
async function markIncomplete() {
  const itemText = this.parentNode.childNodes[1].innerText; // get the text of the item to be completed
  try {
    // try to complete the item
    const response = await fetch('markIncomplete', {
      // fetch the complete item route
      method: 'put', // set the method to put
      headers: { 'Content-Type': 'application/json' }, // set the content type to json
      body: JSON.stringify({
        // set the body to the item text
        itemFromJS: itemText, // set the body to the item text
      }),
    });
    const data = await response.json(); // get the response data
    console.log(data); // log the data
    location.reload(); // reload the page
  } catch (err) {
    // catch any errors
    console.log(err); // log the error
  }
}
