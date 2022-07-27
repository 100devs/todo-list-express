// ***********************************
// Declaring Query Selectors
// ***********************************
const deleteBtn = document.querySelectorAll('.fa-trash')  // creates variable that selects the delete button
const item = document.querySelectorAll('.item span')  // creates variable that selects the item
const itemCompleted = document.querySelectorAll('.item span.completed')  // creates variable that selects the completed item

// ***********************************
// Looping over our Query Selectors
// ***********************************
// ***** Adding Event Listener to all Delete Buttons *****    
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)  // The event listener runs 'on click' and runs the deleteItem() function
})
// ***** Adding Event Listener to all items *****    
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)  // The event listener runs 'on click' and runs the markComplete() function
})
// ***** Adding Event Listener to all Completed items *****    
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)  // The event listener runs 'on click' and runs the markUnComplete() function
})

// ***********************************
// CRUD Operations Via Fetch Requests
// ***********************************
// ***** Delete Fetch Function - server.js DELETE at path '/deleteItem' *****    
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText  // Creates Variable with the text (todo item) from the item
    try{
        const response = await fetch('deleteItem', {  // Performs a fetch to 'deleteItem' Path
            method: 'delete',  // Specifies a DELETE request
            headers: {'Content-Type': 'application/json'},  // Specifies content type passed to server is JSON format
            body: JSON.stringify({  // turns the object into JSON string to send to the server
              'itemFromJS': itemText
            })
          })
        const data = await response.json()  // once the fetch is finished, save the response as JSON
        console.log(data)  // logs the response data
        location.reload()  // Reloads Page to display changes

    }catch(err){
        console.log(err)
    }
}

// ***** Put Fetch Function - server.js PUT at path '/markComplete' *****    
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText  // Creates Variable with the text (todo item) from the item
    try{
        const response = await fetch('markComplete', {  // Performs a fetch to 'markComplete' Path
            method: 'put',  // Specifies a PUT request
            headers: {'Content-Type': 'application/json'},  // Specifies content type passed to server is JSON format
            body: JSON.stringify({  // turns the object into JSON string to send to the server
                'itemFromJS': itemText
            })
          })
        const data = await response.json()  // once the fetch is finished, save the response as JSON
        console.log(data)  // logs the response data
        location.reload()  // Reloads Page to display changes

    }catch(err){
        console.log(err)
    }
}

// ***** Put Fetch Function - server.js PUT at path '/markUnComplete' *****  
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText  // Creates Variable with the text (todo item) from the item
    try{
        const response = await fetch('markUnComplete', {  // Performs a fetch to 'markUnComplete' Path
            method: 'put',  // Specifies a PUT request
            headers: {'Content-Type': 'application/json'},  // Specifies content type passed to server is JSON format
            body: JSON.stringify({  // turns the object into JSON string to send to the server
                'itemFromJS': itemText
            })
          })
        const data = await response.json()  // once the fetch is finished, save the response as JSON
        console.log(data)  // logs the response data
        location.reload()  // Reloads Page to display changes

    }catch(err){
        console.log(err)
    }
}