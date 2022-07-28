const deleteBtn = document.querySelectorAll('.fa-trash') // Assign all elements with trashcan class to a variable
const item = document.querySelectorAll('.item span') // Assign all span tags with the class of item to a variable
const itemCompleted = document.querySelectorAll('.item span.completed') // Assign all spans with the class of item and completed to a variable


Array.from(deleteBtn).forEach((element)=>{ // Iterate through array items with forEach loop
    element.addEventListener('click', deleteItem) // Add event listener for click on the delete button
})

Array.from(item).forEach((element)=>{ // Iterate through array items with forEach loop
    element.addEventListener('click', markComplete) // Add event listener for click on items
})

Array.from(itemCompleted).forEach((element)=>{ // Iterate through array items with forEach loop
    element.addEventListener('click', markUnComplete) // Add event listener for click on items
})

async function deleteItem(){ // Declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Grabs text from list item
    try{ // Try to do something
        const response = await fetch('deleteItem', { // Response variable waits on fetch to get data from the deleteItem route
            method: 'delete', // Sets CRUD method
            headers: {'Content-Type': 'application/json'}, // Specifying content type
            body: JSON.stringify({
              'itemFromJS': itemText // Set content to text of item
            })
          })
        const data = await response.json() // Waiting on JSON from response ot be converted
        console.log(data) // Logs result to console
        location.reload() // Reload page

    }catch(err){ // Pass error into catch block
        console.log(err) // Log to console
    }
}

async function markComplete(){ 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', { 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){ 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}