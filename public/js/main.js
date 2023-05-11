const deleteBtn = document.querySelectorAll('.fa-trash') // declaring a variable and selecting all classes with .fa-trash
// assigning it to the variable
const item = document.querySelectorAll('.item span') // declaring a variable and assinging it to all classes with .item and span
const itemCompleted = document.querySelectorAll('.item span.completed') // declaring a variable and assinging it to all classes with .item and span that
// has the class of completed on the span

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection on deleteBtn and starting a loop
    element.addEventListener('click', deleteItem) // for each iteration we are putting an event listener ('click') to each deleteBtn and declaring 
    //a function called deleteItem
}) // close loop

Array.from(item).forEach((element)=>{ // creating an array from our selection on item and starting a loop
    element.addEventListener('click', markComplete) // for each iteration we are putting an event listener ('click') to each item and declaring 
    //a function called markComplete
}) // close loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection on itemCompleted and starting a loop
    element.addEventListener('click', markUnComplete) // for each iteration we are putting an event listener ('click') to each itemCompleted and only
    // only completed items, also declaring a function called markUncomplete
}) // close loop

async function deleteItem(){ // declaring an async function that connects to the event listener deleteBtn
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creating a response variable that waits on a fetch to get data from the result of
            // deleteItem route
            method: 'delete', // delete request CRUD for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringfy (turn into a string) that content 
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted and assigning it to the data variable
        console.log(data) // log the result to the console
        location.reload() // refresh the screen to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // console log any errors if they happen
    } // closes catch block
} // closes async function

async function markComplete(){ // declaring an async function that connects to the event listener itemCompleted
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creating a response variable that waits on a fetch to get data from the result of
        // markComplete route
            method: 'put', // update request CRUD for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringfy (turn into a string) that content 
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json()  // waiting on JSON from the response to be converted and assigning it to the data variable
        console.log(data) // log the result to the console
        location.reload() // refresh the screen to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // console log any errors if they happen
    } // closes catch block
} // closes async function

async function markUnComplete(){ // declaring an async function that connects to the event listener item
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creating a response variable that waits on a fetch to get data from the result of
            // markComplete route
            method: 'put', // update request CRUD for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({  // declare the message content being passed and stringfy (turn into a string) that content 
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted and assigning it to the data variable
        console.log(data) // log the result to the console
        location.reload() // refresh the screen to update what is displayeds

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // console log any errors if they happen
    } // closes catch block
} // closes async function