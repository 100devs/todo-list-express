// Selecting different elements
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creating an array based on the previously selected group of elements
// and adding an event listener to each of them via forEach loop tied to a function
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete)
})

// We're declaring an asynchronous function
async function deleteItem() {
  // Grabs the text of the clicked element
  const itemText = this.parentNode.childNodes[1].innerText
  // Doing a try/catch block
  try {
    // Makes a fetch request to /deleteItem using the method: delete
    // We are retrieving data from a server and putting it inside variable response
    const response = await fetch('deleteItem', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // we're transforming it into a string (the previously selected text)
        // inside the body of the request we put it under the 'itemFromJS' property
        itemFromJS: itemText,
      }),
    })
    const data = await response.json() // Waiting on the parsing of the response, the
    // final result is an object
    console.log(data)
    // Reloading the page after the fetch request has worked
    location.reload()
  } catch (err) {
    // If an error occurs, pass the error into the catch block
    console.log(err)
  }
}

async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText
  try {
    const response = await fetch('markComplete', {
      method: 'put', // Setting the CRUD method to 'update' for the route
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch (err) {
    console.log(err)
  }
}

async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText
  try {
    const response = await fetch('markUnComplete', {
      // everything is similar to markComplete
      // except the route
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch (err) {
    console.log(err)
  }
}
