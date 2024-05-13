//remember, this js goes to the DOM to find these, not the EJS file. You remembered because .completed is a dynamic class based on a click.
const deleteBtn = document.querySelectorAll('.fa-trash') //find everything in the DOM that is a trash can and store it in a variable
const item = document.querySelectorAll('.item span') //find everything in the DOM that is a todo list item and store it in a variable
const itemCompleted = document.querySelectorAll('.item span.completed') // find all of the completed to do items in the DOM and store in a variable

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) //add an event listener to all the trash cans. when it hears a click, run the function delete item

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) //add an event listener to all the to do items. when it hears a click, run the function markComplete

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
}) //add an event listener to all the completed items. when it hears a click, run the function markUncomplete

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //grab the item text you want to delete (find in the DOM)
    try{ // this is try-catch structure which helps with error handling in async await functions. you cannot have the catch without the try for them. if you use promises with .then() (AKA NOT ASYNC AWAIT) you CAN use catch() without try 
        const response = await fetch('deleteItem', { // send a request to the server on the endpoint of route of deleteItem (go to server code to find the app.delete()) this takes time so wait for it and then store the response to the fetch in the variable response. This await waits for the fetch to complete
            method: 'delete', //this is the data i'm sending with my request. I am making a delete request
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //I am sending this item in the request body. This is the item I want you to look for and delete. Send it as a string instead of JSON
              'itemFromJS': itemText //store the item to delete in a property called 'itemFromJS'. Not exactly sure why it needs to be stored in a property but just go with it. 
            })
          })
        const data = await response.json() // this await waits for the response to be parsed as json
        console.log(data) // log the response
        location.reload() //tell the browser to refresh (triggers get request)

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //grab item text from the dom
    try{ //handle errors, must be used with a catch in async await syntax 
        const response = await fetch('markComplete', { // send a request to the server to mark something complete. wait for the reponse before moving on 
            method: 'put', //this is a put request, find the matching one in your server code
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ // send something with my request. turn it into a string
                'itemFromJS': itemText //send this, the item text stored as a property
            })
          })
        const data = await response.json() //wait until your response is parsed as json
        console.log(data) // console log the response
        location.reload() //tell the browser to refresh (trigger a get request)

    }catch(err){
        console.log(err)
    }
}

//this is an async function between it makes a fetch (requets something from the server) to mark something uncomplete
async function markUnComplete(){ 
    const itemText = this.parentNode.childNodes[1].innerText // grab the text you want to change 
    try{ //try-catch syntax for error handling. how you have to do it for async await 
        const response = await fetch('markUnComplete', { //send a request on the markUncomplete route and wait for the response since it takes time
            method: 'put', //request type is a put (change something)
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //along with you request, send this in in the body as a string
                'itemFromJS': itemText //this is the thing to send. your text, saved in a property name 
            })
          })
        const data = await response.json() //wait for the response to be parsed as json
        console.log(data) //log the response in the console
        location.reload() //trigger page reload which triggers get request 

    }catch(err){
        console.log(err)
    }
}


