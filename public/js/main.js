//grab the fa-trash class, assign to deleteBtn
const deleteBtn = document.querySelectorAll(".fa-trash");
//grab the .item span, assign to item
const item = document.querySelectorAll(".item span");
//grab the .item span.completed, assign to itemCompleted
const itemCompleted = document.querySelectorAll(".item span.completed");

//turn deleteBtn/s into an array, loop over it
Array.from(deleteBtn).forEach((element) => {
  //add a click listener that runs deleteItem to each element
  element.addEventListener("click", deleteItem);
  //close function
});

//turn item/s into an array, loop over it
Array.from(item).forEach((element) => {
  //add a click listener that runs markComplete to each element
  element.addEventListener("click", markComplete);
  //close function
});

//turn itemCompleted/s into an array, loop over it=
Array.from(itemCompleted).forEach((element) => {
  //add a click listener that runs markUnComplete to each element
  element.addEventListener("click", markUnComplete);
  //close function
});

//use async to run everything in this function at the same time
async function deleteItem() {
  //assign the text value of the list item, parent node is list item
  const itemText = this.parentNode.childNodes[1].innerText;
  //try catch statement
  try {
    //assign response to await for the fetch of the result of deleteItem
    const response = await fetch("deleteItem", {
      //sets CRUD method for route
      method: "delete",
      //the deleteItem will be json
      headers: { "Content-Type": "application/json" },
      //we will turn the body of the deleteItem into a string
      body: JSON.stringify({
        //set content of body as itemText, giving it a key
        "itemFromJS": itemText,
        //close body
      }),
      //close object
    });
    //after the fetch is done and returns
    //data is awaiting the response in json format
    const data = await response.json();
    //once the data has been gotten
    //log the response json
    console.log(data);
    //reload page to update what is displayed
    location.reload();
    //if there's no resolution
  } catch (err) {
    //log error
    console.log(err);
    //close catch
  }
  //close function
}

//async run this function
async function markComplete() {
  ////assign the second child node of clicked item's innertext to itemText
  const itemText = this.parentNode.childNodes[1].innerText;
  //try catch
  try {
    //await fetching markComplete object
    const response = await fetch("markComplete", {
      //sets CRUD method for route
      method: "put",
      //the markComplete will be json
      headers: { "Content-Type": "application/json" },
      //we will turn the body of it into a string
      body: JSON.stringify({
        //set content of body as itemText, giving it a key
        "itemFromJS": itemText,
        //close body
      }),
      //close object
    });
    //after the fetch is complete
    //store it's response in data
    const data = await response.json();
    //after it has been stored
    //log data
    console.log(data);
    //reload page to update what is displayed
    location.reload();
    //if not resolved
  } catch (err) {
    //log error
    console.log(err);
    //close catch
  }
  //close function
}

//async this function
async function markUnComplete() {
  ////assign the second child node of clicked item's innertext to itemText
  const itemText = this.parentNode.childNodes[1].innerText;
  //try catch
  try {
    //await the fetch and store it in response
    const response = await fetch("markUnComplete", {
      //sets CRUD method for route
      method: "put",
      //of json data
      headers: { "Content-Type": "application/json" },
      //turn json data into string
      body: JSON.stringify({
        //set content of body as itemText, giving it a key
        "itemFromJS": itemText,
        //close body
      }),
      //close object
    });
    //after fetch is complete
    //await store response.json into data
    const data = await response.json();
    //after that's completed
    //log data
    console.log(data);
    //reload page to update what is displayed
    location.reload();
    //if no resolve
  } catch (err) {
    //log errorf
    console.log(err);
    //close catch
  }
  //close function
}
