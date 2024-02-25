// this is to generate a nodelist containing all trash icon elements (elements with the class of fa-trash);
const deleteBtn = document.querySelectorAll(".fa-trash");

// this is to generate a nodelist containing all span elements(childNode) in the li (parentNode);
const item = document.querySelectorAll(".item span");

// this is to generate a nodelist containing all tasks that have been completed.
const itemCompleted = document.querySelectorAll(".item span.completed");

// Array.from creates an arraylike object from deleteBtn which can be iterated;
// .forEach iterates over the elements in the array given to us by the Array.from function and adds the event listener to listen for clicks and add the deleteItem function to each element;
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// Array.from creates an arraylike object from deleteBtn which can be iterated;
// .forEach iterates over the elements in the array given to us by the Array.from function and adds the event listener to listen for clicks and add the markComplete function to each element;
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// Array.from creates an arraylike object from deleteBtn which can be iterated;
// .forEach iterates over the elements in the array given to us by the Array.from function and adds the event listener to listen for clicks and add the markUnComplete function to each element;
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// this is an asynchronous funtion that deletes items from the collection in the database. It runs once its called by a event listener;
async function deleteItem() {
  // itemText represents the textContent of the first item in the li which is the parentNode. the childNode[i] is the first element in the li.
  const itemText = this.parentNode.childNodes[1].innerText;
  // The try anc catch statements is used for error handling.
  try {
    // response is the result of the fetch request from the app.delete request handler in the server.js
    const response = await fetch("deleteItem", {
      // this is the method that will be sent with the request; the method key specifies the method to be used in the request.
      method: "delete",
      // headers specify additional information about the request.
      headers: { "Content-Type": "application/json" },
      // The body here contains information about the resource to be deleted. it uses the json.stringify() function to convert the javascript object to a JSON string.
      body: JSON.stringify({
        //key value pair passed to the object to form the request body.
        itemFromJS: itemText,
      }),
    });
    // this awaits the result of the response.json() promise. then stores it in the data variable.
    const data = await response.json();
    // this logs the data. result of the response.json() promise.
    console.log(data);
    // this reloads the page to reflect the changes resulting from deleting the task.
    location.reload();
  } catch (err) {
    // this logs an error in the instance of an error. its an error handler.
    console.log(err);
  }
}

async function markComplete() {
  // itemText represents the textContent of the first item in the li which is the parentNode. the childNode[i] is the first element in the li.

  const itemText = this.parentNode.childNodes[1].innerText;
  // The try and catch statements is used for error handling.
  try {
    // response is the result of the fetch request from the app.put request handler in the server.js
    const response = await fetch("markComplete", {
      // this is the method that will be sent with the request; the method key specifies the method to be used in the request.
      method: "put",
      // headers specify additional information about the request.
      headers: { "Content-Type": "application/json" },
      // The body here contains information about the resource to be deleted. it uses the json.stringify() function to convert the javascript object to a JSON string.
      body: JSON.stringify({
        //key value pair passed to the object to form the request body.
        itemFromJS: itemText,
      }),
    });
    // this awaits the result of the response.json() promise. then stores it in the data variable.
    const data = await response.json();
    // this logs the data. result of the response.json() promise.
    console.log(data);
    // this reloads the page to reflect the changes resulting from deleting the task.
    location.reload();
  } catch (err) {
    // this logs an error in the instance of an error. its an error handler.
    console.log(err);
  }
}

async function markUnComplete() {
  // itemText represents the textContent of the first item in the li which is the parentNode. the childNode[i] is the first element in the li.
  const itemText = this.parentNode.childNodes[1].innerText;
  // The try and catch statements is used for error handling.
  try {
    // response is the result of the fetch request from the app.put request handler in the server.js
    const response = await fetch("markUnComplete", {
      // this is the method that will be sent with the request; the method key specifies the method to be used in the request.
      method: "put",
      // headers specify additional information about the request.
      headers: { "Content-Type": "application/json" },
      // The body here contains information about the resource to be deleted. it uses the json.stringify() function to convert the javascript object to a JSON string.
      body: JSON.stringify({
        //key value pair passed to the object to form the request body.
        itemFromJS: itemText,
      }),
    });
    // this awaits the result of the response.json() promise. then stores it in the data variable.
    const data = await response.json();
    // this logs the data. result of the response.json() promise.
    console.log(data);
    // this reloads the page to reflect the changes resulting from deleting the task.
    location.reload();
  } catch (err) {
    // this logs an error in the instance of an error. its an error handler.
    console.log(err);
  }
}
