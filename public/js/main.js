// Target and store delete button icon
const deleteBtn = document.querySelectorAll('.fa-trash')
// Target task items (more general than completed items)
const item = document.querySelectorAll('.item span.unCompleted')
// Target completed items (same as items but with completed class added) (more restrictive)
const itemCompleted = document.querySelectorAll('.item span.completed')

// Loop through all delete button elements on the page
Array.from(deleteBtn).forEach((element) => {
  // Add click listener to all delete buttons
  element.addEventListener('click', deleteItem) // run deleteItem when clicked
})

// Loop through all item elements on page
Array.from(item).forEach((element) => {
  // Add click listener to all item elements
  element.addEventListener('click', markComplete) // Run markComplete when clicked
})

// Loop through all itemCompleted elements on the page
Array.from(itemCompleted).forEach((element) => {
  // Add click listener to all completed items
  element.addEventListener('click', markUnComplete) // Run markUnComplete when clicked
})

// Run when delete button is pressed
async function deleteItem() {
  // Get the text from the parent node of the clicked item
  const itemText = this.parentNode.children[0].innerText.trim()
  // Start error handling for fetch request
  try {
    // make fetch request to a this server /deleteItem path (see server.js for path)
    const response = await fetch('deleteItem', { // begin header object to apply fetch settings
      method: 'delete', // This will be delete method
      headers: { 'Content-Type': 'application/json' }, // Tell the server the body will be json
      body: JSON.stringify({
        // Add the text from above as a value in the json object
        'itemFromJS': itemText
      })
    })
    // When above request is finished parse the response from the server as json
    const data = await response.json()
    // Log the server response
    console.log(data)
    // Web api to reload page
    location.reload()

  } catch (err) { // Error handling start (error in try block)
    // Log the error to console
    console.log(err)
  }
}

// Run when item is clicked
async function markComplete() {
  // Get text from parent node of clicked item
  const itemText = this.parentNode.children[0].innerText.trim()
  // Start error handling for fetch request
  try {
    // Make fetch request to this server /markComplete path (see server.js for path)
    const response = await fetch('markComplete', {
      method: 'put', // This will be a put method (update)
      headers: { 'Content-Type': 'application/json' }, // Tell the server the body will be json
      body: JSON.stringify({
        // Add the text from above as a value in the json object
        'itemFromJS': itemText
      })
    })
    // When above request is finished parse the response from the server as json
    const data = await response.json()
    // Log the server response to the console
    console.log(data)
    // Web api to reload page
    location.reload()

  } catch (err) { // Error handling start (error in try block)
    // Log the error to the console
    console.log(err)
  }
}

// Run when completed item is clicked
async function markUnComplete() {
  // Get the text from parent node of clicked item
  const itemText = this.parentNode.children[0].innerText.trim()
  // Start error handling for fetch request
  try {
    // make fetchrequest to this server /markUnComplete path (see server.js for path)
    const response = await fetch('markUnComplete', {
      method: 'put', // This will be a put method (update)
      headers: { 'Content-Type': 'application/json' }, // Tell the server the body will be json
      body: JSON.stringify({
        // Add the text from above as a value in the json object
        'itemFromJS': itemText
      })
    })
    // When above request is finished parse the response from the server as json
    const data = await response.json()
    // Log the server response to the console
    console.log(data)
    // Web api to reload the page
    location.reload()

  } catch (err) { // Error handling start
    // Log the error to the console
    console.log(err)
  }
}