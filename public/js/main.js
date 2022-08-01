// BIG PICTURE: this file adds event listeners on the page, sends some stuff up to the server, and waits to hear back from it.

const deleteBtn = document.querySelectorAll('.fa-trash') //create a variable and assigning it to a selection of all elements with a class of the trash can icon
const item = document.querySelectorAll('.item span') //create a variable and assign it to a selection of span tags inside a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //create a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element) => { //create an array from our selection and starting a loop
  element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click, that can call the deleteItem function
}) //close our loop

Array.from(item).forEach((element) => { //create an array from our selection and starting a loop
  element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click, that can call the markComplete function
})//close our loop

Array.from(itemCompleted).forEach((element) => { //create an array from our selection and starting a loop
  element.addEventListener('click', markUnComplete) //add an event listener to ONLY completed items, that waits for a click, that can call the markUnComplete function
})// close our loop

async function deleteItem() { //declare an asynchronous function
  const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs ONLY the inner text within the list span
  try { //starting a try block
    const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of deleteItem route
      method: 'delete', //sets the CRUD method for the route
      headers: { 'Content-Type': 'application/json' }, //sets the headers for the route, specifying the type of content expected, which is JSON
      body: JSON.stringify({ //declare the message content being passed, and stringify that content
        'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
      }) //closing the body
    }) //closing the object
    const data = await response.json() //waiting on JSON from the response to be converted
    console.log(data) //log the result to the console
    location.reload() //reloads the page to update what is displayed

  } catch (err) { //staring a catch block, if an error occurs, pass the error into the catch block
    console.log(err) //log the error to the console
  } //close the catch block
}//end the function

async function markComplete() { //declare an asynchronous function
  const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs ONLY the inner text within the list span
  try { //starting a try block
    const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of markComplete route
      method: 'put', //sets the CRUD method for the route
      headers: { 'Content-Type': 'application/json' }, //declare the message content being passed, and stringify that content
      body: JSON.stringify({ //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
        'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
      }) //closing the body
    }) //closing the object
    const data = await response.json() //waiting on JSON from the response to be converted
    console.log(data) //log the result to the console
    location.reload() //reloads the page to update what is displayed

  } catch (err) { //staring a catch block, if an error occurs, pass the error into the catch block
    console.log(err) //log the error to the console
  } //close the catch block
} //end the function

async function markUnComplete() { //declare an asynchronous function
  const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs ONLY the inner text within the list span
  try { //starting a try block
    const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of markUnComplete route
      method: 'put', //sets the CRUD method for the route
      headers: { 'Content-Type': 'application/json' }, //declare the message content being passed, and stringify that content
      body: JSON.stringify({ //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
        'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
      }) //closing the body
    }) //closing the object
    const data = await response.json() //waiting on JSON from the response to be converted
    console.log(data) //log the result to the console
    location.reload() //reloads the page to update what is displayed

  } catch (err) { //staring a catch block, if an error occurs, pass the error into the catch block
    console.log(err) //log the error to the console
  } //close the catch block
} //end the function