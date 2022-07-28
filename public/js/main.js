// assign variable deleteBtn as the html class ".fa-trash"
const deleteBtn = document.querySelectorAll('.fa-trash');
// assign variable item as the html class ".item span"
const item = document.querySelectorAll('.item span');
// assign variable itemCompleted as the html class ".item span.completed"
const itemCompleted = document.querySelectorAll('.item span.completed');

// add an eventlistener, click, to each deleteBtn that runs deleteItem()
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});
// add event listener to each item and run markComplete() when clicked
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});
// add event listener to each item and run markComplete() when clicked
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// make an asynchronous function names deleteItem
async function deleteItem() {
  // itemText is set to the innerText(html) of the 2nd array element
  // of the selected parent DOM element
  const itemText = this.parentNode.childNodes[1].innerText;
  // try this below
  try {
    // fetch our app.delete function from server.js
    const response = await fetch('deleteItem', {
      // set our method for the function as delete
      method: 'delete',
      // apply appropriate headers so node is not confused
      headers: { 'Content-Type': 'application/json' },
      // set the node body json object as  json string
      body: JSON.stringify({
        // stringify this key,value pair
        itemFromJS: itemText,
      }),
    });
    // set data as a promise that waits for the response.json to finish
    const data = await response.json();
    // log our data
    console.log(data);
    // refresh page
    location.reload();
    // if error occurs, console log it
  } catch (err) {
    console.log(err);
  }
}
// set up asynchronous function
async function markComplete() {
  // itemText is set to the innerText(html) of the 2nd array element
  // of the selected parent DOM element
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // fetch our app.put (markComplete) function from server.js
    const response = await fetch('markComplete', {
      // set our method for the function as put
      method: 'put',
      // apply appropriate headers so node is not confused
      headers: { 'Content-Type': 'application/json' },
      // set the node body json object as  json string
      body: JSON.stringify({
        // stringify this key,value pair
        itemFromJS: itemText,
      }),
    });
    // set data as a promise that waits for the response.json to finish
    const data = await response.json();
    // log our data
    console.log(data);
    // refresh page
    location.reload();
    // if error occurs, console log it
  } catch (err) {
    console.log(err);
  }
}

async function markUnComplete() {
  // set inner text of itemText to 2nd item in child node
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // fetch markedUnComplete from server
    const response = await fetch('markUnComplete', {
      // PUT to update item
      method: 'put',
      //set headers
      headers: { 'Content-Type': 'application/json' },
      // set body data to json
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //After promise is returned log data and reload page
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    // if theres and error log error
    console.log(err);
  }
}
