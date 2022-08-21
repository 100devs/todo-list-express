const deleteBtn = document.querySelectorAll('.fa-trash') // Set a variable for our delete button code
const item = document.querySelectorAll('.item span') // Set a variable for the item to target
const itemCompleted = document.querySelectorAll('.item span.completed') // Set a variable for the completed items

Array.from(deleteBtn).forEach((element)=>{ // Loop through all of the delete buttons and do the following
    element.addEventListener('click', deleteItem) // Add an event listener to each of them
})

Array.from(item).forEach((element)=>{ // Loop through all of the items and do the following
    element.addEventListener('click', markComplete) // Add an event listener to each of them
})

Array.from(itemCompleted).forEach((element)=>{ // Loop through all of the completed items and do the following
    element.addEventListener('click', markUnComplete) // Add an event listener to each of them
})

async function deleteItem(){ // Create a function that does the following
    const itemText = this.parentNode.childNodes[1].innerText // Get the text of the selected item
    try{
        const response = await fetch('deleteItem', { // Send a request to delete the item from the DB
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // Wait for a response from the server
        console.log(data) // Console log the response
        location.reload()

    }catch(err){
        console.log(err) // catch any errors and console log them if detected
    }
}

async function markComplete(){  // Create a function that does the following
    const itemText = this.parentNode.childNodes[1].innerText // Get the text of the selected item
    try{
        const response = await fetch('markComplete', { // Send a request to update the item in the DB
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // Wait for a response from the server
        console.log(data) // Console log the response
        location.reload()

    }catch(err){
        console.log(err) // Catch any errors and console log them if detected
    }
}

async function markUnComplete(){ // Create a function that does the following
    const itemText = this.parentNode.childNodes[1].innerText // Get the text of the selected item
    try{
        const response = await fetch('markUnComplete', { // Send a request to update the item in the DB
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // Wait for a response from the server
        console.log(data) // Console log the response
        location.reload()

    }catch(err){
        console.log(err) // Catch any errors and console log them if detected
    }
}