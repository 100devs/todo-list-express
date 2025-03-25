// selects all elements that have the class .fa-trash
const deleteBtn = document.querySelectorAll(".fa-trash");
// selects all span elements with the class of .item and saves them in an item NodeList
const item = document.querySelectorAll(".item span");
// selects all span elements with a class of .completed and a class of .item
const itemCompleted = document.querySelectorAll(".item span.completed");

// add a click event listener and call deleteItem fnc to each delete button in the deleteBtn NodeList
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});
// // add a click event listener and call markComplete fnc to each item in the item NodeList
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// // add a click event listener and call markComplete fnc to each completed item in the itemCompleted NodeList
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// declare an async deleteItem function
async function deleteItem() {
  // declare a constant that retrieves the inner text of a li
  const itemText = this.parentNode.childNodes[1].innerText;
  // try syntax
  try {
    // sends a delete request to the server using await fetch()
    const response = await fetch("deleteItem", {
      // specifies the delete http request
      method: "delete",
      //   the requests headers indicates the request body is JSON
      headers: { "Content-Type": "application/json" },
      //   converts the javascript into a JSON string
      body: JSON.stringify({
        // sends the text of the li to the server
        itemFromJS: itemText,
      }),
    });
    // saves the response from the server into data and logs it to the console
    const data = await response.json();
    console.log(data);

    // after the fetch request is complete it refreshes the page with reload()
    location.reload();
    // catch syntax
  } catch (err) {
    console.log(err);
  }
}

// declares an async function that marks a todo completed
async function markComplete() {
  // var that retrieves the text from a li
  const itemText = this.parentNode.childNodes[1].innerText;
  //   try syntax
  try {
    // sends an HTTP request to the markComplete endpoint and
    //  waits for it to complete before moving to the next line
    const response = await fetch("markComplete", {
      // tells the server it's a PUT method
      method: "put",
      //   sets the request headers to indicate that the request body contains JSON
      headers: { "Content-Type": "application/json" },
      //   converts the javascript into a JSON string
      body: JSON.stringify({
        // sends the text of the li to the server
        itemFromJS: itemText,
      }),
    });
    // converts the response from the server into a JavaScript object and saves the data to data
    const data = await response.json();
    // log the data
    console.log(data);
    // refreshes the page
    location.reload();
    // catch syntax
  } catch (err) {
    // logs the error
    console.log(err);
  }
}

// declares an async function called markUnComplete
async function markUnComplete() {
  // constant that grabs the inner text of a li
  const itemText = this.parentNode.childNodes[1].innerText;
  //   try syntax
  try {
    // sends an HTTP request to the markUnComplete endpoint
    const response = await fetch("markUnComplete", {
      // tells the server it's a PUT request
      method: "put",
      // sets the request headers to indicate that the req body contains JSON
      headers: { "Content-Type": "application/json" },
      // converts the JavaScript object into an JSON
      body: JSON.stringify({
        // sends the text to be deleted from the li to the server
        itemFromJS: itemText,
      }),
    });
    // converts the response from the server into a JSON and saves it to data
    const data = await response.json();
    console.log(data);
    // refreshes the page
    location.reload();
    // catch syntax
  } catch (err) {
    console.log(err);
  }
}
