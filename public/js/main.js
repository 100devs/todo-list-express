// stores all elements with the class .fa-trash in a deleteBtn variable for later use
const deleteBtn = document.querySelectorAll('.fa-trash');
// stores all elements with the classes .item and nested span and stores them in the item variable
const item = document.querySelectorAll('.item span');
// stores all elements with the item class and spans with a completed class
const itemCompleted = document.querySelectorAll('.item span.completed');

// the from method turns the deleteBtn variable into a array so that the forEach element can loop through each element with .fa-trash class and add a addEventListener, which activates the deleteItem function on click
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

// the from method turns the item variable into a array so that the forEach element can loop through each element with item class with a nested span and add a addEventListener,  which activates the deleteItem function on click

Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// the from method turns the item variable into a array so that the forEach element can loop through each element with item class with a nested span and add a addEventListener,  which activates the deleteItem function on click

// async keyword indicates that the function will return a promise and permits a await within the function

async function deleteItem() {
  // the this keyword refers to the element that is triggered, the parent node and then its second child nodes innerText is accessed and stored in the itemText variable

  const itemText = this.parentNode.childNodes[1].innerText;
  //the try block is executed first and if there is an exception the catch block is ran
  try {
    // a fetch request is sent to the server with the deleteItem url. The await portion waits for a server response before executing and storing in the response variable.
    const response = await fetch('deleteItem', {
      //sets the http method to delete during the fetch so that the server knows it is a delete request
      method: 'delete',
      // indicates that the data being sent to the request body is JSON format
      headers: { 'Content-Type': 'application/json' },

      // converts the object with property of itemFromJS and value of itemText into JSON as a body of an HTTP request
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // the code execution is paused until response json has a resolved promise, then returns json data to the data variable
    const data = await response.json();
    //console logs data variable of json
    console.log(data);
    //reloads the webpage resetting the dom and JavaScript state to see changes
    location.reload();
    // if the try block fails the catch will console.log an error
  } catch (err) {
    console.log(err);
  }
}
// async keyword indicates that the function will return a promise and permits a await within the function
async function markComplete() {
  // the this keyword refers to the element that is triggered, the parent node and then its second child nodes innerText is accessed and stored in the itemText variable
  const itemText = this.parentNode.childNodes[1].innerText;
  //the try block is executed first and if there is an exception the catch block is ran
  try {
    // a fetch request is sent to the server with the markComplete url. The await portion waits for a server response before executing and storing in the response variable.
    const response = await fetch('markComplete', {
      //sets the http method to put during the fetch so that the server knows it is a put/update request
      method: 'put',
      // indicates that the data being sent to the request body is JSON format
      headers: { 'Content-Type': 'application/json' },
      // converts the object with property of itemFromJS and value of itemText into JSON as a body of an HTTP request
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // the code execution is paused until response json has a resolved promise, then returns json data to the data variable
    const data = await response.json();
    //data is console logged
    console.log(data);
    //reloads the webpage resetting the dom and JavaScript state to see changes
    location.reload();
    // if the try block fails the catch will console.log an error
  } catch (err) {
    console.log(err);
  }
}
// async keyword indicates that the function will return a promise and permits a await within the function
async function markUnComplete() {
  // the this keyword refers to the element that is triggered, the parent node and then its second child nodes innerText is accessed and stored in the itemText variable
  const itemText = this.parentNode.childNodes[1].innerText;
  //the try block is executed first and if there is an exception the catch block is ran
  try {
    // a fetch request is sent to the server with the markUnComplete url. The await portion waits for a server response before executing and storing in the response variable.
    const response = await fetch('markUnComplete', {
      //sets the http method to put during the fetch so that the server knows it is a put/update request
      method: 'put',
      // indicates that the data being sent to the request body is JSON format
      headers: { 'Content-Type': 'application/json' },
      // converts the object with property of itemFromJS and value of itemText into JSON as a body of an HTTP request
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // the code execution is paused until response json has a resolved promise, then returns json data to the data variable
    const data = await response.json();
    // data is console logged json
    console.log(data);
    //reloads the webpage resetting the dom and JavaScript state to see changes
    location.reload();
    // if the try block fails the catch will console.log an error
  } catch (err) {
    console.log(err);
  }
}
