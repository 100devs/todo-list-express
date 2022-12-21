// Select all delete buttons on the page and assign them to the variable deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')

// Select all to-do items on the page and assign them to the variable item
const item = document.querySelectorAll('.item span')

// Select all completed to-do items on the page and assign them to the variable itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed')

// Loop through the delete buttons and attach an event listener to each button
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Loop through the to-do items and attach an event listener to each item
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Loop through the completed to-do items and attach an event listener to each item
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Async function to delete a to-do item
async function deleteItem(){
    // Get the text of the to-do item
    const itemText = this.parentNode.childNodes[1].innerText

    // Try to send a delete request to the server, along with the item text
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })

        // Parse the response as JSON and assign it to the "data" variable
        const data = await response.json()

        // Log the response data to the console
        console.log(data)

        // Reload the page
        location.reload()

    // Catch any error and log it to the console
    }catch(err){
        console.log(err)
    }
}

// Async function to mark a to-do item as complete
async function markComplete(){
    // Get the text of the to-do item
    const itemText = this.parentNode.childNodes[1].innerText

    // Try to send a put request to the server, along with the item text
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        // Parse the response as JSON and assign it to the "data" variable
        const data = await response.json()

        // Log the response data to the console
        console.log(data)

        // Reload the page
        location.reload()

    // Catch any error and log it to the console
    }catch(err){
        console.log(err)
    }
}

// Async function to mark a completed to-do item as incomplete
async function markUnComplete(){
    // Get the text of the to-do item
    const itemText = this.parentNode.childNodes[1].innerText

    // Try to send a put request to the server, along with the item text
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Parse the response as JSON
        const data = await response.json()

        // Log the response data to the console
        console.log(data)

        // Reload the page
        location.reload()

    // Catch any error and log it to the console
    }catch(err){
        console.log(err)
    }
}