//grab the fa-trash class, assign to deleteBtn
const deleteBtn = document.querySelectorAll(".fa-trash");
//grab the .item span, assign to item
const item = document.querySelectorAll(".item span");
//grab the .item span.completed, assign to itemCompleted
const itemCompleted = document.querySelectorAll(".item span.completed");

//turn deleteBtn into an array, loop over it, and add a click listener that runs deleteItem to each element
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

//turn item into an array, loop over it, and add a click listener that runs markComplete to each element
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

//turn itemCompleted into an array, loop over it, and add a click listener that runs markUnComplete to each element
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

//use async to run everything in this function at the same time
async function deleteItem() {
  //assign the second child node of clicked item's innertext to itemText
  const itemText = this.parentNode.childNodes[1].innerText;
  //try catch statement
  try {
    //assign response to wait for the fetch of deleteItem, returning an object from deleteItem
    const response = await fetch("deleteItem", {
      //delete method removes item
      method: "delete",
      //the deleteItem will be json
      headers: { "Content-Type": "application/json" },
      //we will turn the body of the deleteItem into a string and store it as itemText
      body: JSON.stringify({
        "itemFromJS": itemText,
      }),
    });
    //after the fetch is done and returns
    //data is awaiting the response in json format
    const data = await response.json();
    //once the data has been gotten
    //log the response json
    console.log(data);
    //reload location
    location.reload();
    //if there's no resolution
  } catch (err) {
    //log error
    console.log(err);
  }
}

//async run this function
async function markComplete() {
  ////assign the second child node of clicked item's innertext to itemText
  const itemText = this.parentNode.childNodes[1].innerText;
  //try catch
  try {
    //await fetching markComplete object
    const response = await fetch("markComplete", {
      //put method will add to markComplete
      method: "put",
      //the markComplete will be json
      headers: { "Content-Type": "application/json" },
      //we will turn the body of it into a string and store it as itemText
      body: JSON.stringify({
        "itemFromJS": itemText,
      }),
    });
    //after the fetch is complete
    //store it's response in data
    const data = await response.json();
    //after it has been stored
    //log data
    console.log(data);
    //reload location
    location.reload();
    //if not resolved
  } catch (err) {
    //log error
    console.log(err);
  }
}

//async this function
async function markUnComplete() {
  ////assign the second child node of clicked item's innertext to itemText
  const itemText = this.parentNode.childNodes[1].innerText;
  //try catch
  try {
    //await the fetch and store it in response
    const response = await fetch("markUnComplete", {
      //it will be a put call
      method: "put",
      //of json data
      headers: { "Content-Type": "application/json" },
      //turn json data into string store in itemText
      body: JSON.stringify({
        "itemFromJS": itemText,
      }),
    });
    //after fetch is complete
    //await store response.json into data
    const data = await response.json();
    //after that's completed
    //log data
    console.log(data);
    //reload location
    location.reload();
    //if no resolve
  } catch (err) {
    //log error
    console.log(err);
  }
}
