// query selector for all trash can images
const deleteBtn = document.querySelectorAll(".fa-trash");
// query selector for all spans without a class in the li with class item
const item = document.querySelectorAll(".item span");
// query selector for all spans with the class completed in the li with class item
const itemCompleted = document.querySelectorAll(".item span.completed");

// converts the node list of trash cans into an array, and adds an eventlistener to each one
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// converts the node list of spans without a class into an array, and adds an eventlistener to each one
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// converts the node list of spans with class completed into an array, and adds an eventlistener to each one
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// runs when a trash can is clicked
async function deleteItem() {
  // gets the innertext of the span that was clicked
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // fetch request with the information from the click to the server
    // delete item is the url that it will send the data to
    const response = await fetch("deleteItem", {
      // delete is what the request is designed to do
      method: "delete",
      // lets the server know to expect the request in json format
      headers: { "Content-Type": "application/json" },
      // converts what we pass to it into json
      body: JSON.stringify({
        // sends the server the text that we got from the dom
        itemFromJS: itemText,
      }),
    });
    //   displays the message recieved from the server
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// runs when a span is clicked without the class of completed
async function markComplete() {
  // selects the text of the span within the li
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // fetch request we are making to the server
    const response = await fetch("markComplete", {
      // the method that our request will have
      method: "put",
      // lets the server know to expect json
      headers: { "Content-Type": "application/json" },
      // converts what we pass to it into json
      body: JSON.stringify({
        // the variable we are passing to the server with the text we got from the dom
        itemFromJS: itemText,
      }),
    });
    //   displays a message if the request completes
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// runs if a span with the class of completed is clicked
async function markUnComplete() {
  // gets the text from the span with class of completed within the li
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // fetch request
    const response = await fetch("markUnComplete", {
      // lets the server know what kind of request is being made
      method: "put",
      //   lets the server know to rexpect json
      headers: { "Content-Type": "application/json" },
      //   converts what we provide it into json format
      body: JSON.stringify({
        // text from the dom we are passing to the server
        itemFromJS: itemText,
      }),
    });
    // response from the server if the request is completed
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
