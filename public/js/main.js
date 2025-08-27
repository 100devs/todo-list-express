// Select all delete buttons (trash icons) on the page
const deleteBtn = document.querySelectorAll('.fa-trash')

// Select all <span> elements inside the li with class 'item'
const item = document.querySelectorAll('.item span')

// Select all <span> elements that are already marked as completed
const itemCompleted = document.querySelectorAll('.item span.completed')

// Add a click event listener to each delete button
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Add a click event listener to each incomplete item marking it as completed
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Add a click event listener to each completed item marking it as uncompleted
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Function to delete an item
async function deleteItem(){
    // Get the text content of the task to be deleted
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a DELETE request to the server with the item text
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Parse the JSON response from the server and store it in the variable `data`
        const data = await response.json()
        console.log(data)
        // Reload the page to show updated list
        location.reload()
    // If an error occurs in the try block, catch it and log it to the console
    }catch(err){
        console.log(err)
    }
}

// Function to mark an item as complete
async function markComplete(){
    // Get the text content of the task to be updated
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a PUT request to mark item as complete
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Parse the JSON response from the server and store it in the variable `data`
        const data = await response.json()
        console.log(data)
        // Reload the page to show the updated list
        location.reload()
    // If an error occurs in the try block, catch it and log it to the console
    }catch(err){
        console.log(err)
    }
}

// Function to mark an item as uncomplete (undo complete)
async function markUnComplete(){
    // Get the text content of the task to be updated
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a PUT request to the server to mark the item as incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Parse the JSON response from the server and store it in the variable `data`
        const data = await response.json()
        console.log(data)
        // Reload the page to show the updated list
        location.reload()
    // If an error occurs in the try block, catch it and log it to the console
    }catch(err){
        console.log(err)
    }
}