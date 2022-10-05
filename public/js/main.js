// Select all delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
// Select all not completed items
const item = document.querySelectorAll('.item span')
// Select all completed items
const itemCompleted = document.querySelectorAll('.item span.completed')
 
// Convert nodelist into array then loop through array
Array.from(deleteBtn).forEach((element)=>{
    // Add a click listener for deleting item 
    element.addEventListener('click', deleteItem)
})
 
// Convert nodelist into array then loop through array
Array.from(item).forEach((element)=>{
    // Add a click listener to mark item as completed
    element.addEventListener('click', markComplete)
})
 
// Convert nodelist into array then loop through array
Array.from(itemCompleted).forEach((element)=>{
    // Add a click listener to mark item as incomplete
    element.addEventListener('click', markUnComplete)
})
 
// Declare an async function for deleting todo item
async function deleteItem(){
    // Select the todo item to be deleted
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a delete request to the server to delete the selected item
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Await for server response
        const data = await response.json()
        // Log server response data
        console.log(data)
        // Force browser to refresh
        location.reload()
 
    }catch(err){
        console.log(err)
    }
}
 
// Declare an async function to mark todo item as completed
async function markComplete(){
    // Select the todo item to mark as completed
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a put request to the server to update item as completed
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Await for server response
        const data = await response.json()
        // Log response data
        console.log(data)
        // Force browser refresh
        location.reload()
 
    }catch(err){
        console.log(err)
    }
}
 
// Declare an async function to mark todo item as incomplete 
async function markUnComplete(){
    // Select todo item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a put request to the server to update item as incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Await for server response
        const data = await response.json()
        // Log server response data
        console.log(data)
        // Force browser refresh
        location.reload()
 
    }catch(err){
        console.log(err)
    }
}