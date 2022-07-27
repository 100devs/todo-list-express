// assigns all the elements with class name .fa-trash to the deleteBtn variable (creates a static NodeList)
const deleteBtn = document.querySelectorAll('.fa-trash');
// assigns all the elements with class name .item which are a span to the item variable (creates a static NodeList)
const item = document.querySelectorAll('.item span');
// assigns all the elements with class name .item which are a span with the class completed  to the itemCompleted variable (creates a static NodeList)
const itemCompleted = document.querySelectorAll('.item span.completed');

// Since we potentially have many elements in NodeList deleteBtn turn them into an array so the we can use them
// loop over each of the items in the array we've created with forEach
// for each element in that array, add an event listener (aka SMURF) that will listen for a click and run the deleteItem function
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

// Since we potentially have many elements in NodeList item turn them into an array so the we can use them
// loop over each of the items in the array we've created with forEach
// for each element in that array, add an event listener (aka SMURF) that will listen for a click and run the markComplete function
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

// Since we potentially have many elements in NodeList itemCompleted turn them into an array so the we can use them
// loop over each of the items in the array we've created with forEach
// for each element in that array, add an event listener (aka SMURF) that will listen for a click and run the markUnComplete function
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// Create an asynchronous function (b/c we're going somewhere else to do something so it might be awhile) named deleteItem
async function deleteItem() {
  // Because there are potentially many of these buttons, focus on this item (where the click originated, see eventlistener above)
  // Go to the parent of this eventlistener (corresponds to the <li> element in our index.ejs) and then go to the childNode at index 1
  // and grab the value of innerText - assign that to itemText
  // I'm a bit confused, I thought this would be index [0]
  const itemText = this.parentNode.childNodes[1].innerText;
  // If that works
  try {
    // Create a promise that asynchronously goes to the deleteItem route
    // options for the route are the method (which is delete), headers (indicating that the content will by json)
    // and fills the body of the request with a property itemFromJS set to the itemText (our todo title)
    // if the promise fulfills save the response as a variable called response
    const response = await fetch('deleteItem', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // parse the response as json and save it to the variable data
    const data = await response.json();
    // tell the developer via the console what the data contains
    console.log(data);
    // reload the page since we need to remove the deleted item from our ejs rendering
    location.reload();
    // if the promise rejects, tell the developer about it in the console
  } catch (err) {
    console.log(err);
  }
}

// Create an asynchronous function (b/c we're going somewhere else to do something so it might be awhile) named markComplete
async function markComplete() {
  // Because there are potentially many of these buttons, focus on this item (where the click originated, see eventlistener above)
  // Go to the parent of this eventlistener (corresponds to the <li> element in our index.ejs) and then go to the childNode at index 1
  // and grab the value of innerText - assign that to itemText
  // I'm a bit confused, I thought this would be index [0]
  const itemText = this.parentNode.childNodes[1].innerText;
  // If that works
  try {
    // Create a promise that asynchronously goes to the markComplete route
    // options for the route are the method (which is put), headers (indicating that the content will by json)
    // and fills the body of the request with a property itemFromJS set to the itemText (our todo title)
    // if the promise fulfills save the response as a variable called response
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // parse the response as json and save it to the variable data
    const data = await response.json();
    // tell the developer via the console what the data contains
    console.log(data);
    // reload the page since we need to remove the deleted item from our ejs rendering
    location.reload();
    // if the promise rejects, tell the developer about it in the console
  } catch (err) {
    console.log(err);
  }
}

// Create an asynchronous function (b/c we're going somewhere else to do something so it might be awhile) named markUnComplete
async function markUnComplete() {
  // Because there are potentially many of these buttons, focus on this item (where the click originated, see eventlistener above)
  // Go to the parent of this eventlistener (corresponds to the <li> element in our index.ejs) and then go to the childNode at index 1
  // and grab the value of innerText - assign that to itemText
  // I'm a bit confused, I thought this would be index [0]
  const itemText = this.parentNode.childNodes[1].innerText;
  // If that works
  try {
    // Create a promise that asynchronously goes to the markUnComplete route
    // options for the route are the method (which is put), headers (indicating that the content will by json)
    // and fills the body of the request with a property itemFromJS set to the itemText (our todo title)
    // if the promise fulfills save the response as a variable called response
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // parse the response as json and save it to the variable data
    const data = await response.json();
    // tell the developer via the console what the data contains
    console.log(data);
    // reload the page since we need to remove the deleted item from our ejs rendering
    location.reload();
    // if the promise rejects, tell the developer about it in the console
  } catch (err) {
    console.log(err);
  }
}
