const deleteBtn = document.querySelectorAll('.fa-trash') // get all the delete buttons
const item = document.querySelectorAll('.item span') // getting all the todo items
const itemCompleted = document.querySelectorAll('.item span.completed')// getting all the completed to do items

// Creating an array of all the deleteBtns then iterating over them and adding an eventlistener to each one
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// Creating an array of all the todo items then iterating over them and adding an eventlistener to each one
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// Creating an array of all the completed todo items then iterating over them and adding an eventlistener to each one
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// declare asynchronous function
async function deleteItem(){
    // grabbing text from todo item and store in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    // try block is executed when there is no errors
    try{
        // send a request to the server via the fetch method
        const response = await fetch('deleteItem', {
            method: 'delete', // HTTP method being sent
            headers: {'Content-Type': 'application/json'}, // sets the content type header
            body: JSON.stringify({ //request body, is the data we are sending to the server side and deleting in ourDB
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // the reponse that the fetch responds with
        console.log(data)// logging our 'data'/ response in the browser console
        location.reload()// reload our page

    }catch(err){ // executed when there is an error
        console.log(err)
    }
}

// declare asynchronous function
async function markComplete(){
    // grabbing text from todo item and store in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    // try block is executed when there is no errors
    try{
        // send a request to the server via the fetch method
        const response = await fetch('markComplete', {
            method: 'put', // HTTP method being sent
            headers: {'Content-Type': 'application/json'}, // sets the content-type header
            body: JSON.stringify({ //request body, is the data we are sending to the server side and changing in ourDB
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //the response that the fetch responds with.
        console.log(data) // logging our 'data'/ response in the browser console
        location.reload() // reload our page

    }catch(err){ // executed when there is an error
        console.log(err)
    }
}
// declare asynchronous function
async function markUnComplete(){
    // grabbing text from todo item and store in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    // try block is executed when there is no errors
    try{
        // send a request to the server via the fetch method
        const response = await fetch('markUnComplete', {
            method: 'put',  // HTTP method being sent
            headers: {'Content-Type': 'application/json'},// sets the content-type header
            body: JSON.stringify({ //request body, is the data we are sending to the server side and changing in ourDB
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //the response that the fetch responds with.
        console.log(data) // logging our 'data'/ response in the browser console
        location.reload() // reload our page

    }catch(err){ // executed when there is an error
        console.log(err)
    }
}