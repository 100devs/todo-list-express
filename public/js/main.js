// selects all trash icons
const deleteBtn = document.querySelectorAll('.fa-trash')
// selects  all TODO items
const item = document.querySelectorAll('.item span')
// selects all completed TODO items
const itemCompleted = document.querySelectorAll('.item span.completed') 
// creates an array of all trash icons and sets an event listener on each
Array.from(deleteBtn).forEach((element)=>{
    // when clicked the deleteItem function will run
    element.addEventListener('click', deleteItem)
})
// creates an array of all TODO list items and sets an event listener on each
Array.from(item).forEach((element)=>{
    // when clicked the function markComplete will run
    element.addEventListener('click', markComplete)
})
// creates an array of all completed TODO list items and sets an event listener on them
Array.from(itemCompleted).forEach((element)=>{
    //when clicked the markUnComplete function will run
    element.addEventListener('click', markUnComplete)
})
// this is our function that sends the delete request to our server along with data on what we want to delete
async function deleteItem(){
    // stores the inner text of the TODO list
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', { //submits the delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            // this is how the server will know what we want to remove from the database
              'itemFromJS': itemText
            })
          })
        // stores the server response in a variable
        const data = await response.json()
        // logs the server confirmation message
        console.log(data)
        //refresh the page
        location.reload()

    }catch(err){
        // if unsuccessful log the error
        console.log(err)
    }
}

// the markComplete function sends a PUT request in order mark a TODO item as completed
async function markComplete(){
    // stores the inner text of a TODO item into an variable
    const itemText = this.parentNode.childNodes[1].innerText 
    try{
        // submits the PUT request to the server and passes long the inner text of the TODO item
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // store the server response in variable  
        const data = await response.json()
        // Log the server response "Marked Complete" to the console
        console.log(data)
        // refresh the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// works the same way as markComplete on the client-side, but the server knows to handle this differently
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // the markUnComplete route is what makes the difference here
        // everything thing else works the same as markComplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        // logs "Marked uncomplete" to the console
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}