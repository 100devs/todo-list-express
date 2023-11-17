// Select all font awesome trash icons with class '.fa-trash' and assigning them to 'deletéBtn'
const deleteBtn = document.querySelectorAll('.fa-trash')
// Assign all span elements within parent elements of class '.item'  to 'item'
const item = document.querySelectorAll('.item span')
// Assign all span elements of class .completed within parent element of class '.items' to 'itemsCompleted'
const itemCompleted = document.querySelectorAll('.item span.completed')

// Adding listener to delete buttons to run callback 'deleteItem' on click event
Array.from(deleteBtn).forEach(element => {
  element.addEventListener('click', deleteItem)
})
// Adding listener to each uncompleted list item  to run callback 'markComplete' on click event
Array.from(item).forEach(element => {
  element.addEventListener('click', markComplete)
})
// Adding listener to each uncompleted list item to run callback 'markUnComplete' on click event
Array.from(itemCompleted).forEach(element => {
  element.addEventListener('click', markUnComplete)
})

async function deleteItem() {
  // Take the parent node of the trash icon, the li element, and grab the inner text of its child node at index 1. This is the first span element
  // assign 'itemText' its innerText
  const itemText = this.parentNode.childNodes[3].innerText.trim()
  try {
    // Using fetch, 'try' to make a DELETE request to route '/deleteItem' with 'itemFromJS' being assigned 'itemText'
    const response = await fetch('deleteItem', {
      method: 'delete',
      // Set header to 'Content-Type' 'application/json' so the server knows we are sending JSON and can parse our data
      headers: { 'Content-Type': 'application/json' },
      // Using stringify to convert our body content to a JSON string and assigning it to 'body'
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    })
    // Take the body of the fulfilled response as JSON and return as a JS object and assign it to 'data'
    const data = await response.json()
    // Log data to console
    console.log(data)
    // Refresh page
    location.reload()
    // If error, log to console
  } catch (err) {
    console.log(err)
  }
}

async function markComplete() {
  // Take the parent node of 'item', the li element, and grab the inner text of its child node at index 1. This is the first span element.
  // Assign 'itemText' its innerText
  const itemText = this.parentNode.innerText.trim()
  try {
    // Using fetch, attempt send a PUT request to '/markComplete' with 'itemText' set to 'itemFromJS' in the body
    const response = await fetch('markComplete', {
      method: 'put',
      // Set header to 'Content-Type' 'application/json' so the server knows we are sending JSON and can parse our data
      headers: { 'Content-Type': 'application/json' },
      // Using stringify, convert our body content to a JSON string and assign it to 'body'
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    })
    // Take the body of the fulfilled response as JSON, return it as a JS object, and assign it to 'data'
    const data = await response.json()
    // Log data to console
    console.log(data)
    // Refresh page
    location.reload()
  } catch (err) {
    // If error, log error to console
    console.log(err)
  }
}

async function markUnComplete() {
  // Take the parent node of 'itemCompleted', the li element, and grab the inner text of its child node at index 1. This is the first span element
  // Assign 'itemText' its innerText
  const itemText = this.parentNode.innerText.trim()
  try {
    // Using fetch, attempt send a PUT request to '/markUnComplete' with 'itemText' being assigned to 'itemFromJS' in the body
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      // Using stringify, convert our body content to a JSON string and then assign it to 'body'
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    })
    // Take the body of the fulfilled response as JSON and return as a JS object and assign it to 'data'
    const data = await response.json()
    // Log data to console
    console.log(data)
    // Refresh page
    location.reload()
  } catch (err) {
    // If error, log error to console
    console.log(err)
  }
}
