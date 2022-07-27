// Storing all elements in the dom with class '.fa-trash' in node list 
const deleteBtn = document.querySelectorAll('.fa-trash')

// storing all paragraphs elements inside ".item" class inside a node list 
const item = document.querySelectorAll('.item p')
// storing all paragraphs elements inside ".item" class that also have a completed class inside a node list 
const itemCompleted = document.querySelectorAll('.item p.completed')

// Creating an array from the node list "deletedBtn", then assigning each with an event listener that goes to function "deleteItem"
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// Creating an array from the node list item, then assigning each an event listener that goes to function markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//Creating an array from the list item completed, then assigning each an event listener that goes to function markUncompleted
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// an async function to delete the todo item associated with the delete icon we clicked
async function deleteItem(){
    // Were getting the text of the todo item and saving it in variable itemText
    const itemText = this.parentNode.children[0].innerText
    try{
        // Sending a delete request to the server wit the following parameters
        const response = await fetch('deleteItem', {
            // Specifying that this is a delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            // defining the key itemFromJs as the text form the to-do item
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //Waiting for a response server
        const data = await response.json()
        //console log response
        console.log(data)
        //reload the page 
        location.reload()
    // basic error msg
    }catch(err){
        console.log(err)
    }
}

//Async function to mark a todo item as complete
async function markComplete(){
    // Getting the text of the todo item and storing in itemText
    const itemText = this.parentNode.children[0].innerText
    // Sending a put request to the server to mark the item as completed
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
             // defining the key itemFromJs as the text form the to-do item
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Waiting for response 
        const data = await response.json()
        //console log  server response 
        console.log(data)
        // reload 
        location.reload()
    // console.log errors 
    }catch(err){
        console.log(err)
    }
}


//Async function to mark a todo item as incomplete
async function markUnComplete(){
    // getting the text of the todo item and storing in itemText
    const itemText = this.parentNode.children[0].innerText
    console.log(itemText)
    try{
        // sending a put request ti the server to mark a completed item at incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // defining the key itemFromJs as the text form the to-do item
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // waiting for a response
        const data = await response.json()
        // console log response 
        console.log(data)
        // reload the page
        location.reload()
    // console log any errors 
    }catch(err){
        console.log(err)
    }
    
}