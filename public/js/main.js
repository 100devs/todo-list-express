// Selecting class 'fa-trash' → Delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
// Selecting children spans of class 'item' → tasks/list items
const item = document.querySelectorAll('.item span')
// Selecting class 'completed' spans, children to class 'item' →  completed tasks/list items
const itemCompleted = document.querySelectorAll('.item span.completed')

// Delete buttons call deleteItem function on click
Array.from(deleteBtn).forEach((element)=>{ 
    element.addEventListener('click', deleteItem)
})

// Looping through array → Adding click listener to each list item
Array.from(item).forEach((element)=>{
    // Incomplete list items call markComplete
    element.addEventListener('click', markComplete)
})

// Looping thorugh array → Adding click listener to each list item
Array.from(itemCompleted).forEach((element)=>{
    // Complete list items call markUncomplete
    element.addEventListener('click', markUnComplete)
})

// Function to send delete request to server
async function deleteItem(){
    // Obtain task name typed in input
    const itemText = this.parentNode.childNodes[1].innerText  
    try{
        // Sends delete request to server
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // Text (task name) also added to req body sent to the server - Identifies doc to be deleted
              'itemFromJS': itemText 
            })
          })
        // Parses & logs JSON data
        const data = await response.json()
        console.log(data)
        // Page refresh after update
        location.reload() 
    // Error handling
    }catch(err){
        console.log(err)
    }
}

// Function to update completed tasks → Sends put request to server
async function markComplete(){
    // Obtain task name in the li node's inner text
    const itemText = this.parentNode.childNodes[1].innerText 
    try{
        // sends /markComplete put request to server
        const response = await fetch('markComplete', { 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // Task name included in req body sent to the server → Identifies doc to be updated
                'itemFromJS': itemText  
            })
          })
        // Parsing json response logging it
        const data = await response.json() 
        console.log(data)
        // Page refresh after update
        location.reload()  
    // Error handling
    }catch(err){
        console.log(err)
    }
}

// Function to change Uncompleted tasks → Sends put request to server
async function markUnComplete(){
    // Obtain task name in the li node's inner text
    const itemText = this.parentNode.childNodes[1].innerText 
    try{
        // Sends /markUncomplete put request to server
        const response = await fetch('markUnComplete', { 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // Task name included in req body sent to the server → Identifies doc to be updated
                'itemFromJS': itemText
            })
          })
        // Parses & logs JSON data
        const data = await response.json()
        console.log(data)
        // Page refresh after update
        location.reload() 
    // Error handling
    }catch(err){
        console.log(err)
    }
}