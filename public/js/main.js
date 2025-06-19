const deleteBtn = document.querySelectorAll('.fa-trash')    // trash can icons
const item = document.querySelectorAll('.item span')        // select todo items
const itemCompleted = document.querySelectorAll('.item span.completed') // select completed todo items
//  add event listener to trash can icons next to todo items. Click to Delete the todo item
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//  add event listener todo items. Click to toggle complete/incomplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//  add event listener to completed todo items next to todo items. Click to toggle complete/incomplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// Asynchronously delete an item 
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText    // Get the text content of the item to be deleted, that is the second child of the parent node
    try{
        // Send a delete request to the server with the itemText in its body
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()      // Parse the JSON response
        console.log(data)       // Log the data
        location.reload()       // reload page to render deletion

    }catch(err){
        console.log(err)        // Log any errors
    }
}
// Asynchronously mark an item as completed
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText    // Get the text content of the todo item to mark complete
    try{
        // Send a put/update request to the server to mark the item complete with its itemText in its body
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()      // Parse the JSON response
        console.log(data)       // Log the data
        location.reload()       // reload page to render deletion

    }catch(err){
        console.log(err)        // Log any errors
    }
}
// Asynchronously mark an item as incomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText        // Get the text content of the todo item to unmark complete
    try{
        // Send a put/update request to the server to unmark the item complete with its itemText in its body
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()      // Parse the JSON response
        console.log(data)       // Log the data
        location.reload()       // reload page to render deletion

    }catch(err){
        console.log(err)        // Log any errors
    }
}