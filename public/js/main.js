// stores all elements with the class .fa-trash in a deleteBtn variable for later use
const deleteBtn = document.querySelectorAll('.fa-trash');
// stores all elements with the classes .item and nested span and stores them in the item variable
const item = document.querySelectorAll('.item span');
// stores all elements with the item class and spans with a completed class
const itemCompleted = document.querySelectorAll('.item span.completed');

// the from method turns the deleteBtn variable into a array so that the forEach element can loop through each element with .fa-trash class and add a addEventListener, which activates the deleteItem function on click
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

// the from method turns the item variable into a array so that the forEach element can loop through each element with item class with a nested span and add a addEventListener,  which activates the deleteItem function on click

Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// the from method turns the item variable into a array so that the forEach element can loop through each element with item class with a nested span and add a addEventListener,  which activates the deleteItem function on click

// async keyword indicates that the function will return a promise and permits a await within the function

async function deleteItem() {
  // the this keyword refers to the element that is triggered, the parent node and then its second child nodes innerText is accessed and stored in the itemText variable

  const itemText = this.parentNode.childNodes[1].innerText;
  //the try block is executed first and if there is an exception the catch block is ran
  try {
    // a fetch request is sent to the server with the deleteItem url. The await portion waits for a server response before executing and storing in the response variable.
    const response = await fetch('deleteItem', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
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

async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
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

async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
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
