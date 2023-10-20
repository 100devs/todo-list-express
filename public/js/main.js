const deleteBtn = document.querySelectorAll('.fa-trash'); //selects all trash icon elements and stores them in variable deleteBtn
const item = document.querySelectorAll('.item span'); //selects all spans inside elements with class .item and stores them in variable item
const itemCompleted = document.querySelectorAll('.item span.completed'); // selects all span's with class .completed inside .item elements and stores them in variable itemCompleted

// creates array containing all deleteBtn elements
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem); //adds event listener to each element of the array (trash icon) and calls deleteItem function when element is clicked
});

// creates array containing all item elements
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete); //adds event listener to each element of the array of items and calls markComplete function when element is clicked
});
// creates array containing all completed item elements
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete); //adds event listener to each element of the array of completed items and calls markUnComplete function when element is clicked
});

// async function which will delete item if executed
async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText; //retrieves text content of the second child node of the parent node of the current element and stores it in the variable itemText

  //   try/catch block of async function syntaxis
  try {
    // sends delete request to the API route 'deleteItem' in json format containing itemText variable
    const response = await fetch('deleteItem', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      //   request body
      body: JSON.stringify({
        itemFromJS: itemText, // creates a new object with prop itemFromJS and assigns itemText variable to it
      }),
    });
    const data = await response.json(); // waiting for response from API and responds in json format when response resolved
    console.log(data); //logs response data
    location.reload(); // reloads current web page
    // catch block to catch errors
  } catch (err) {
    console.log(err); // in case of error, logs the error to console
  }
}

//async function to mark items as complete
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; //retrieves text content of the second child node of the parent node of the current element and stores it in the variable itemText

  try {
    // sends update request to the API route 'markComplete' in json format containing itemText variable
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText, // creates a new object with prop itemFromJS and assigns itemText variable to it
      }),
    });
    const data = await response.json(); // waiting for response from API and responds in json format when response resolved
    console.log(data); //logs response data
    location.reload(); // reloads current web page
    // catch block to catch errors
  } catch (err) {
    console.log(err); // in case of error, logs the error to console
  }
}

//async function to mark items as uncomplete
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; //retrieves text content of the second child node of the parent node of the current element and stores it in the variable itemText
  try {
    // sends update request to the API route 'markUnComplete' in json format containing itemText variable
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText, // creates a new object with prop itemFromJS and assigns itemText variable to it
      }),
    });
    const data = await response.json(); // waiting for response from API and responds in json format when response resolved
    console.log(data); //logs response data
    location.reload(); // reloads current web page
    // catch block to catch errors
  } catch (err) {
    console.log(err); // in case of error, logs the error to console
  }
}
