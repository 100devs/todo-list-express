// Storing all elements in DOM with class specified in a nodelist specified as variables declared with keyword 'const'
const deleteBtn = document.querySelectorAll('.fa-trash')                // (all elements with class of'fa-trash')
const item = document.querySelectorAll('.item span')                    // (within elements with class of 'item', all span elements)
const itemCompleted = document.querySelectorAll('.item span.completed') // (within elements with class of 'item', all span elements with class of 'completed')

// Creating an array from the nodelist to add an event listener to each node using forEach method. 
// When a specific node is clicked, the corresponding callback function is called.
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete)
})

// The Following 3 asynchronous functions are the callback functions within the event listenters.
// Declare an async function to delete the specified todo item associated with the trash can icon
async function deleteItem() {
  // the 'this' keyword references the specific node that was clicked on. 
  // that node's parent node is the list item element that also has a child, text, that can be displayed. 
  // trim the text and save to const itemText
  const itemText = this.parentNode.children[0].innerText.trim()
  try { // try catch block to try to delete the specified node (if error, console log the error)
    // send a delete req to the server w the following parameters
    const response = await fetch('deleteItem', { // create a response variable that waits on a fetch (global method) to get data from the result of the deleteItem route
      method: 'delete', // sets CRUD method to delete
      headers: { 'Content-Type': 'application/json' }, // specifying the headers that the content-type expected is JSON
      body: JSON.stringify({ // body property holds the text. turn that text into JSON and set to value for body property
        itemFromJS: itemText, // property 'itemFromJS' with value set to the text of the list item
      }), // close fetch's second parameter
    }) // close response object
    const data = await response.json() // waiting on the JSON object in the response to be converted back to JavaScript object
    console.log(data) // log returned object
    location.reload() // reload page to show an updated page (post-delete action)
  } catch (err) {
    console.log(err) // log the error object to console
  }
}
// Declare an async function to mark the specified todo item as complete
async function markComplete() {
  // the 'this' keyword references the specific node that was clicked on.
  // that node's parent node is the list item element that also has a child, text, that can be displayed.
  // trim the text and save to const itemText
  const itemText = this.parentNode.children[0].innerText.trim()
  // sending a put request to the server
  try { // try catch block to try to update the specified node (if error, console log the error)
    // send a put req to the server w the following parameters
    const response = await fetch('markComplete', { // create a response variable that waits on a fetch (global method) to get data from the result of the markComplete route
      method: 'put', // sets CRUD method to update
      headers: { 'Content-Type': 'application/json' }, // specifying the headers that the content-type expected is JSON
      body: JSON.stringify({ // body property holds the text. turn that text into JSON and set to value for body property
        itemFromJS: itemText // property 'itemFromJS' with value set to the text of the list item
        }) // close fetch's second parameter
      }) // close response object
    const data = await response.json() // waiting on the JSON object in the response to be converted back to JavaScript object
    console.log(data) // log returned object
    location.reload() // reload page to show an updated page (post-update action)
  } catch (err) {
    console.log(err) // log the error object to console
  } // close try catch block
} // close function declaration
// Declare an async function to mark the specified todo item as 'un'-complete
async function markUnComplete() {
  // the 'this' keyword references the specific node that was clicked on.
  // that node's parent node is the list item element that also has a child, text, that can be displayed.
  // trim the text and save to const itemText
  const itemText = this.parentNode.children[0].innerText.trim()
  // sending a put request to the server
  try { // try catch block to try to update the specified node (if error, console log the error)
    const response = await fetch('markUnComplete', { // create a response variable that waits on a fetch (global method) to get data from the result of the markComplete route 
      method: 'put', // sets CRUD method to update
      headers: { 'Content-Type': 'application/json' }, // specifying the headers that the content-type expected is JSON
      body: JSON.stringify({ // body property holds the text. turn that text into JSON and set to value for body property
        itemFromJS: itemText, // property 'itemFromJS' with value set to the text of the list item
      }), // close fetch's second parameter
    }) // close response object
    const data = await response.json() // waiting on the JSON object in the response to be converted back to JavaScript object
    console.log(data) // log returned object
    location.reload() // reload page to show an updated page (post-update action)
  } catch (err) {
    console.log(err) // log the error object to console
  } // close try catch block
} // close function declaration
