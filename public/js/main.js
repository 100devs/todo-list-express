//Collect all the delete buttons in a NodeList
const deleteBtn = document.querySelectorAll('.fa-trash');
//Collect all the spans that have a .item parent in a NodeList
const item = document.querySelectorAll('.item span');
//Collect all the spans with a completed class and with a parent of .item
const itemCompleted = document.querySelectorAll('.item span.completed');
//Assign an event listener with a deleteItem function to all the delete buttons
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});
//Assign an event listener for all the items with a callback function of markComplete
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});
//Assign an event listener for all the completed items with a markUnComplete callback
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

async function deleteItem() {
  //constant variable to hold the text from the item by searching for its parent element and the first childNode.
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    //fetch request to the deleteItem route
    const response = await fetch('deleteItem', {
      //assigning the method
      method: 'delete',
      //setting the headers
      headers: { 'Content-Type': 'application/json' },
      //setting the body of the request to be in a Json string format
      body: JSON.stringify({
        //itemFromJS will be the property and itemText will be the value being sent
        itemFromJS: itemText,
      }),
    });
    //wait for the response in Json
    const data = await response.json();
    //log the response
    console.log(data);
    //reload the site
    location.reload();
    //console log errors
  } catch (err) {
    console.log(err);
  }
}

async function markComplete() {
  //assign the text of the element to the itemText constant
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    //fetch request on markComplete route setting up the request methods, headers and body
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //wait for the response
    const data = await response.json();
    //log the reponse
    console.log(data);
    //reload page
    location.reload();
    //console log errors
  } catch (err) {
    console.log(err);
  }
}

async function markUnComplete() {
  //Hold the value of the item in the itemText variable
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    //make a put request in the markUnComplete route setting the method, headers and body
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //parse the reponse in json format
    const data = await response.json();
    //log the data
    console.log(data);
    //reload page
    location.reload();

    //console log errors
  } catch (err) {
    console.log(err);
  }
}
