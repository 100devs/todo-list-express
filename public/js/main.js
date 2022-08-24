// Array of elements from document with selected class.
const deleteBtn = document.querySelectorAll('.fa-trash')
// Array of elements from document with selected class.
const item = document.querySelectorAll('.item span')
// Array of elements from document with selected class.
const itemCompleted = document.querySelectorAll('.item span.completed')

// Loop through elements in the deleteBtn array.
Array.from(deleteBtn).forEach((element)=>{
    // Listen for click event and execute the deleteItem function.
    element.addEventListener('click', deleteItem)
})

// Loop through elements in the item array.
Array.from(item).forEach((element)=>{
    // Listen for click event and execute the markComplete function.
    element.addEventListener('click', markComplete)
})

// Loop through elements in the itemCompleted array.
Array.from(itemCompleted).forEach((element)=>{
    // Listen for click event and execute the markUnComplete function.
    element.addEventListener('click', markUnComplete)
})

// Async function declaration for deleting item.
async function deleteItem(){
    // Grab inner text of the span within the list item.
    const itemText = this.parentNode.childNodes[1].innerText

    // Try to sucessfuly execute the block of code
    try{ 
        // Await for the result of the fetch sent to deleteItem.
        const response = await fetch('deleteItem', {
            // Set the method to delete.
            method: 'delete',
            // Set type of content being passed to JSON.
            headers: {'Content-Type': 'application/json'},
            // Set body of response to a JSON object.
            body: JSON.stringify({
              'itemFromJS': itemText // Send itemFromJS with the itemText variable.
            })
          })
        // Await for response and set data to the response JSON.
        const data = await response.json()
        // Console log the response.
        console.log(data)
        // Reload the page.
        location.reload()
    // If an error occurs.
    }catch(err){
        // Console log the error.
        console.log(err)
    }
}

// Async function declaration for marking item as complete.
async function markComplete(){
    // Grab inner text of the span within the list item.
    const itemText = this.parentNode.childNodes[1].innerText

    // Try to sucessfuly execute the block of code
    try{
        // Await for the result of the fetch sent to markComplete.
        const response = await fetch('markComplete', {
            // Set the method to put (update).
            method: 'put',
            // Set type of content being passed to JSON.
            headers: {'Content-Type': 'application/json'},
            // Set body of response to a JSON object.
            body: JSON.stringify({
                'itemFromJS': itemText // Send itemFromJS with the itemText variable.
            })
          })
        // Await for response and set data to the response JSON.
        const data = await response.json()
        // Console log the response.
        console.log(data)
        // Reload the page.
        location.reload()
    // If an error occurs.
    }catch(err){
        // Console log the error.
        console.log(err)
    }
}

// Async function declaration for marking item as incomplete.
async function markUnComplete(){
    // Grab inner text of the span within the list item.
    const itemText = this.parentNode.childNodes[1].innerText
    // Try to sucessfuly execute the block of code
    try{
        // Await for the result of the fetch sent to markComplete.
        const response = await fetch('markUnComplete', {
            // Set the method to put (update).
            method: 'put',
            // Set type of content being passed to JSON.
            headers: {'Content-Type': 'application/json'},
            // Set body of response to a JSON object.
            body: JSON.stringify({
                'itemFromJS': itemText // Send itemFromJS with the itemText variable.
            })
          })
        // Await for response and set data to the response JSON.
        const data = await response.json()
        // Console log the response.
        console.log(data)
        // Reload the page.
        location.reload()
    // If an error occurs.
    }catch(err){
        // Console log the error.
        console.log(err)
    }
}