//Declares a constant variable of all selectors with the ".fa-trash" class
const deleteBtn = document.querySelectorAll(".fa-trash");
//Declares a constant variable of all selectors with the "item" and "span" classes
const item = document.querySelectorAll(".item span");
//Declares a constant variable of all selectors with the ".item" and "span.completed" classes
const itemCompleted = document.querySelectorAll(".item span.completed");

//Creates an array of all selectors with the class of ".fa-trash" then adds an event listen to each of them, upon the event "click", the deleteItem async function is run on the specific selector that the event occurred on
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});
//Creates an array of all selectors with the classes of ".item" and "span" then adds an event listener to each of them, upon the event "click", the markComplete async function is run on the specific selector that the event occurred on
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});
//Creates an array of all selectors with the classes of ".item" and "span.completed" then adds an event listener to each of them, upon the vent "click", the markUnComplete async function is run on the specific selector that the event occurred on
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

//Declares asynchronous function named deleteItem that deletes an item from the linked database
async function deleteItem() {
  //Declares a constant variable that contains the first childNode within the parentnode of the line in the DOM of the index.ejs file upon which the event called the deleteItem function then runs the innerText method on that childNode when it is called
  const itemText = this.parentNode.childNodes[1].innerText;
  //Attempts to retrieve a response from the database; if an error is returned rather than the expected response, the catch below will execute
  try {
    //Declares a constant variable that containts the awaited response from the fetch exection of the deleteItem function from the main.js file
    const response = await fetch("deleteItem", {
      //Assigns the method to be executed as delete so the database knows what to do with it
      method: "delete",
      //Notifies the program the type of file to expect as a response so that it knows how to render it (as json in this case)
      headers: { "Content-Type": "application/json" },
      //Renders JSON response into a string...
      body: JSON.stringify({
        //...with the key of itemFromJS and the value from the itemText variable above
        itemFromJS: itemText,
      }),
    });
    //Declares a constant variable that contains the awaited parsing of the response as json
    const data = await response.json();
    //Logs to the console the contents of the data variable
    console.log(data);
    //Reloads page to show updates from result of async function deleteItem
    location.reload();
    //If the try above does not receive the expected response, the catch will execute with the parameter of the error that was returned
  } catch (err) {
    //Logs to the console the error passed in as a parameter when the try above did not receive the expected response
    console.log(err);
  }
}

//Declares asynchronous function named markComplete that updates the an item from the linked database
async function markComplete() {
  //Declares a constant variable that contains the first childNode within the parentnode of the line in the DOM of the index.ejs file upon which the event called the markComplete function then runs the innerText method on that childNode when it is called
  const itemText = this.parentNode.childNodes[1].innerText;
  //Attempts to retrieve a response from the database; if an error is returned rather than the expected response, the catch below will execute
  try {
    //Declares a constant variable that containts the awaited response from the fetch execution of the markComplete function from the main.js file
    const response = await fetch("markComplete", {
      //Assigns the method to be executed as put/update so the database knows what to do with it
      method: "put",
      //Notifies the program the type of file to expect as a response so that it knows how to render it (as json in this case)
      headers: { "Content-Type": "application/json" },
      //Renders JSON response into a string...
      body: JSON.stringify({
        //...with the key of itemFromJS and the value from the itemText variable above
        itemFromJS: itemText,
      }),
    });
    //Declares a constant variable that contains the awaited parsing of the response as json
    const data = await response.json();
    //Logs to the console the contents of the data variable
    console.log(data);
    //Reloads page to show updates from result of async function deleteItem
    location.reload();
    //If the try above does not receive the expected response, the catch will execute with the parameter of the error that was returned
  } catch (err) {
    //Logs to the console the error passed in as a parameter when the try above did not receive the expected response
    console.log(err);
  }
}

//Declares asynchronous function named markUnComplete that updates the an item from the linked database
async function markUnComplete() {
  //Declares a constant variable that contains the first childNode within the parentnode of the line in the DOM of the index.ejs file upon which the event called the markUnComplete function then runs the innerText method on that childNode when it is called
  const itemText = this.parentNode.childNodes[1].innerText;
  //Attempts to retrieve a response from the database; if an error is returned rather than the expected response, the catch below will execute
  try {
    //Declares a constant variable that containts the awaited response from the fetch execution of the markUnComplete function from the main.js file
    const response = await fetch("markUnComplete", {
      //Assigns the method to be executed as put/update so the database knows what to do with it
      method: "put",
      //Notifies the program the type of file to expect as a response so that it knows how to render it (as json in this case)
      headers: { "Content-Type": "application/json" },
      //Renders JSON response into a string...
      body: JSON.stringify({
        //...with the key of itemFromJS and the value from the itemText variable above
        itemFromJS: itemText,
      }),
    });
    //Declares a constant variable that contains the awaited parsing of the response as json
    const data = await response.json();
    //Logs to the console the contents of the data variable
    console.log(data);
    //Reloads page to show updates from result of async function deleteItem
    location.reload();
    //If the try above does not receive the expected response, the catch will execute with the parameter of the error that was returned
  } catch (err) {
    //Logs to the console the error passed in as a parameter when the try above did not receive the expected response
    console.log(err);
  }
}
