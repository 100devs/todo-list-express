// Here we're using querySelectorAll to obtain a NodeList of all DOM items that match the given criteria.
const deleteBtn = document.querySelectorAll(".fa-trash"); // selecting all elements with the class name "fa-trash"
const item = document.querySelectorAll(".item span"); // selecting all span elements that are children of elements with the class "item"
const itemCompleted = document.querySelectorAll(".item span.completed"); // selecting all span elements with the class "completed" that are children of elements with the class "item"

// Each of the above NodeLists are converted into arrays, which we iterate through using .forEach,  assigning each element in the array (i.e., all of the matching nodes) event listeners

Array.from(deleteBtn).forEach((element) => {
  // On click, the deleteItem function will be called
  element.addEventListener("click", deleteItem);
});

Array.from(item).forEach((element) => {
  // On click, the markComplete function will be called
  element.addEventListener("click", markComplete);
});

Array.from(itemCompleted).forEach((element) => {
  // On click, the markUnComplete function will be called
  element.addEventListener("click", markUnComplete);
});

async function deleteItem() {
  // We assign to the variable named "itemText" the value of the text that was clicked.  But how do we get that?  We have to set up and step back down, so to speak:  we start at "this", which is the event target (the node that triggered the event), then look at its parent node (which is the <li> element), then look at the .innerText value of the <li>'s child.
  // Under the circumstance, this appears to be unnecessary:  const itemText = this.innerText would work just as well.
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // The way async/await functions are written makes this read very confusingly.
    // The response from the server will be bound to the variable "response"
    // Within the fetch() we find the request made to the server.  "deleteItem" is the endpoint, and then the object literal is the information contained in the request.

    const response = await fetch("deleteItem", {
      // the method (delete)
      method: "delete",
      // the headers, which indicate the format of the data that is being included with the request (JSON, in this case)
      headers: { "Content-Type": "application/json" },
      // and then we build the body of the request:  we have our object literal, which contains the text from the event target assigned to a particular value, and then turn it into a JSON string using JSON.stringify()
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Here the client takes the server's response (which will come in the form of a JSON object literal) and parses it to produce a JavaScript object, which is assigned to the variable name "data"
    const data = await response.json();
    // The response (in this case, the message "Todo Deleted") is logged to the client console.
    console.log(data);
    // And the client forces a page reload.  (I.e., it makes another "GET" request to the server and triggers the app.get("/"....) controller)
    location.reload();
    // If there's an error at any point along the way, it's "caught" here and logged to the console.
  } catch (err) {
    console.log(err);
  }
}

//
async function markComplete() {
  // See the massive comment I wrote above.
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // This request is targeting a different endpoint ("markComplete") to the one above
    const response = await fetch("markComplete", {
      // This time we're using the "put" method, which indicates that we'll be updating an existing document.
      method: "put",
      // Again, telling the server to expect the content-type JSON
      headers: { "Content-Type": "application/json" },
      // Same as above; all that will change is what the server does with this information.
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Again, all of this is identical to what was in the earlier function.
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// The fetch request in this function targets a new endpoint ("markUnComplete") but is otherwise identical to the one above.  This seems like a prime target for a refactor.
async function markUnComplete() {
  // Same thing as above
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
