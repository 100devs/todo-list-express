const deleteBtn = document.querySelectorAll('.fa-trash'); //decalre deleteBtn
const item = document.querySelectorAll('.item span'); //declare item
const itemCompleted = document.querySelectorAll('.item span.completed'); //delclare itemCompleted

//add deleteItem click event to all selected deleteBtn
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

//loop over all item and add click event markComplete to all selected item
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

//loop over all markComplete and add click event markUnComplete to them all
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// declare an async function
async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText; //look inde of the list item and grabs only the inner text with in the list span
  try {
    //start of try catch block
    const response = await fetch('deleteItem', {
      //create a response varible by waits on fetch to get data from the result of the deleteItem route
      method: 'delete', //the CRUD method is delete
      headers: { 'Content-Type': 'application/json' }, //exptected content type is JSON
      body: JSON.stringify({
        //declare the message content and make it string
        itemFromJS: itemText, //content body is itemText
      }),
    });
    const data = await response.json(); //wait until response is converted to JSON assign it to data
    console.log(data); //log the data
    location.reload(); //reload the page to update display
  } catch (err) {
    // catch of the try catch block
    console.log(err); //if there is error, log error
  }
}

async function markComplete() {
  // declare markComplete function as an async function
  const itemText = this.parentNode.childNodes[1].innerText; //look inside the list item and grabs only the inner text of the span
  try {
    //try part of the try catch block
    const response = await fetch('markComplete', {
      //creates a response varible that waits on data fetch from markComplete route
      method: 'put', //method is PUT
      headers: { 'Content-Type': 'application/json' }, //headers content is JSON
      body: JSON.stringify({
        //body  is JSON that converted to string
        itemFromJS: itemText, //content of body is inner text of itemText
      }),
    });
    const data = await response.json(); //waiting for response to be converted to JSON
    console.log(data); //log data to console.
    location.reload(); //reload the page to update display
  } catch (err) {
    //catch part of the try catch block
    console.log(err); //if there is error, log the error
  }
}

async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; //look inside the list item and grabs only the inner text of the span
  try {
    //try part of the try catch block
    const response = await fetch('markUnComplete', {
      //creates a response varible that waits on data fetch from markComplete route
      method: 'put', //method is PUT
      headers: { 'Content-Type': 'application/json' }, //headers content is JSON
      body: JSON.stringify({
        //body  is JSON that converted to string
        itemFromJS: itemText, //content of body is inner text of itemText
      }),
    });
    const data = await response.json(); //waiting for response to be converted to JSON
    console.log(data); //log data to console.
    location.reload(); //reload the page to update display
  } catch (err) {
    //catch part of the try catch block
    console.log(err); //if there is error, log the error
  }
}
