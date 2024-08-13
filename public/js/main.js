// Declaring constants at the top of the file
// These are the items that can be clicked on in the UI - the deletle button, the item itself (shown when the item is not complete) and the span that is shown when the item is completed
const deleteBtn = document.querySelectorAll('.fa-trash');
const item = document.querySelectorAll('.item span');
const itemCompleted = document.querySelectorAll('.item span.completed');

// Iterate through the nodelist of delete buttons and add an event listener to each one that listens for a click and runs deleteItem when it is clicked
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

// Iterate through the items (part visible when the items are not complete) and add event listeners to them. If they are clicked, mark them as complete
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

// Iteerate through the itemCompleted elements and add an event listener allowing you to set them as incomplete when clicked on
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// This is run when the delete button is clicked (a trash icon)
async function deleteItem() {
  // Get the text of a sibling element - contains the name of the item
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Send a fetch (DELETE) request to /deleteItem
    const response = await fetch('deleteItem', {
      // It is a delete request
      method: 'delete',
      //   It is json
      headers: { 'Content-Type': 'application/json' },
      // The body that is sent is the text of the item that has been clicked on
      // Uses JSON.stringify as it standardises the body sent
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Await for the response
    const data = await response.json();
    // Log what you got back  (json saying task deleted)
    console.log(data);
    // Reload the page so the item vanishes
    location.reload();
    // Is there an error?
  } catch (err) {
    // Log it to the console
    console.log(err);
  }
}

// This is used when you click on the text of the todo item
async function markComplete() {
  // Read the text itself to know which item needs marking complete
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Send a fetch request to markComplete
    const response = await fetch('markComplete', {
      // It is a put request, because we are updating the item
      method: 'put',
      // I am sending json
      headers: { 'Content-Type': 'application/json' },
      // Use JSON.stringify to send an object containing the text to the backend
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Wait for the response
    const data = await response.json();
    // log it
    console.log(data);
    // reload the page to show the item ticked off
    location.reload();
    // If there is an error
  } catch (err) {
    // Log it to the console
    console.log(err);
  }
}

// This is used to mark items as incomplete
async function markUnComplete() {
  // Which item was clicked on?
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // A fetch request is sent to the api
    const response = await fetch('markUnComplete', {
      // It is a put request - as I want to update the record
      method: 'put',
      // Sending json
      headers: { 'Content-Type': 'application/json' },
      // And using JSON.stringify to send the text from the todo item
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Read the response, log it to the console and reload the page
    const data = await response.json();
    console.log(data);
    location.reload();
    // Caught an error? Log ig to the console.
  } catch (err) {
    console.log(err);
  }
}
