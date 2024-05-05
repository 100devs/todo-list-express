// set up some const to set up DOM elements
const deleteBtn = document.querySelectorAll(".fa-trash");
const item = document.querySelectorAll(".item span");
const itemCompleted = document.querySelectorAll(".item span.completed");
// add event listener to evry delete buton
Array.from(deleteBtn).forEach(element => {
  element.addEventListener("click", deleteItem);
});
// add event listener to evry todo-item Array.from in the case is not needed
Array.from(item).forEach(element => {
  element.addEventListener("click", markComplete);
});
// add event listener to evry completed item
Array.from(itemCompleted).forEach(element => {
  element.addEventListener("click", markUnComplete);
});
// deletes 1 item thats been clicked on from the database
async function deleteItem() {
  // grabbing the todo item
  //   this referres to the item that is being listened to (button). Parent node navigates through the DOM and finds the parent element of this.
  // childnode[1] grabs the second child node return a nodelist which contain text and spaces , comments
  // this practice pulls the second element because of the line break
  // a better option would be this.parentNode.children[0].innertext
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // will fetch the API on our server.js , its firing a request to delete item URL, server is going to listen and is then going to delete that item becuase on he method (IF server specifies),
    const response = await fetch("deleteItem", {
      // method defines what part of crud we are accessing
      method: "delete",
      //   headers is the type of data we are sending in the body
      headers: { "Content-Type": "application/json" },
      //   on the server side this is where we are getting the req.body from as well as itemFromJs
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // defines data and awaits response from JSON then reloads the URL
    const data = await response.json();
    console.log(data);
    location.reload();
    // if there is an error in the try block and error will console
  } catch (err) {
    console.log(err);
  }
}
// going to reference the server markComplete
// going to fetch to the API ( server.js) look for the markComplete with the method put, written in JSON, to get the response body.ItemFromJs
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // This is going to wait for JSOn to finish and logs it or returns and error
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
// This is going to fetch the API and look for the PUT markUncomplete. its going to go to the parentNode, SKip the whitespace, and access childNode[1](because its skipping whitespace) Its going to look at the put response, written in JSON ,and get the res.body.itemFromJs
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // waits for the body to resolve then reloads or rejects
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
