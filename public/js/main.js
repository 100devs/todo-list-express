// assigning all trash can icon to be use to delete todos
const deleteBtn = document.querySelectorAll(".fa-trash");
// creating variable for all span tags that have the class of item
const item = document.querySelectorAll(".item span");
// creating variable for all spans tag with the class of 'completed' inside of a parent with the class of 'item'
const itemCompleted = document.querySelectorAll(".item span.completed");

// grab deleteBtn and loops through each trash can
Array.from(deleteBtn).forEach((element) => {
  // for each trash gets a event click
  element.addEventListener("click", deleteItem);
});

// loop through each span
Array.from(item).forEach((element) => {
  // assign each span with a event click to mark complete
  element.addEventListener("click", markComplete);
});

// grab itemcompleted variable and loops through each element
Array.from(itemCompleted).forEach((element) => {
  // adds an event listener to only completed items
  element.addEventListener("click", markUnComplete);
});

// declaring a async function deleteItem
async function deleteItem() {
  // looks inside of the list item and grabs only the inner text within the list span
  const itemText = this.parentNode.childNodes[1].innerText;
  //
  try {
    // fetches the deleteItem route from the server
    const response = await fetch("/deleteItem", {
      // sets the CRUD method for the route, which delete item
      method: "delete",
      // specifying the type of content expected, which is JSON
      headers: { "Content-Type": "application/json" },
      //  declare the msg content being passed and stringify the data
      body: JSON.stringify({
        // setting the content of the body tot he inner text of the list item and naming it 'itemFromJS'
        itemFromJS: itemText,
      }),
    });
    // waiting on JSON from the reponse
    const data = await response.json();
    // print data
    console.log(data);
    // reloads webpage
    location.reload();
    // catch error that happen
  } catch (err) {
    // prints out error msg
    console.log(err);
  }
}

// declaring a async function markComplete
async function markComplete() {
  // looks inside of the list item and grabs only the inner text within the list span
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // fetches the markComplete route from the server
    const response = await fetch("markComplete", {
      // sets the CRUD method for the route, which updates the data
      method: "put",
      // specifying the type of content expected, which is JSON
      headers: { "Content-Type": "application/json" },
      //  declare the msg content being passed and stringify the data
      body: JSON.stringify({
        // setting the content of the body tot he inner text of the list item and naming it 'itemFromJS'
        itemFromJS: itemText,
      }),
    });
    // waiting on JSON from the reponse
    const data = await response.json();
    // print data
    console.log(data);
    // reloads webpage
    location.reload();
    // catch error that happen
  } catch (err) {
    // prints out error msg
    console.log(err);
  }
}

// declaring a async function markComplete
async function markUnComplete() {
  // looks inside of the list item and grabs only the inner text within the list span
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // fetches the markUnComplete route from the server
    const response = await fetch("markUnComplete", {
      // sets the CRUD method for the route, which updates the data
      method: "put",
      // specifying the type of content expected, which is JSON
      headers: { "Content-Type": "application/json" },
      //  declare the msg content being passed and stringify the data
      body: JSON.stringify({
        // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
        itemFromJS: itemText,
      }),
    });
    // waiting on JSON from the reponse
    const data = await response.json();
    // print data
    console.log(data);
    // reloads webpage
    location.reload();
    // catch error that happen
  } catch (err) {
    // prints out error msg
    console.log(err);
  }
}
