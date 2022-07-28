const deleteBtn = document.querySelectorAll('.fa-trash') // Creates variable and assigns it to a selection of all elements with a class of the trash can 
const item = document.querySelectorAll('.item span') // Creates variable and assigns it to a selection of span tags inside of a parent that has a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // Creates variable and assigns it to a selection of spans with the class of 'completed' inside of a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // Creates an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // Adds an event listener to the current item that waits for a click and calls function 'deleteItem'
}) // Closes loop

Array.from(item).forEach((element)=>{ // Creates an array from our selection and starts a loop
    element.addEventListener('click', markComplete) // Adds an event listener to the current item that waits for a click and calls function 'markComplete'
}) // Closes loop

Array.from(itemCompleted).forEach((element)=>{ // Creates an array from our selection and starts a loop
    element.addEventListener('click', markUnComplete) // Adds an event listener to ONLY completed items that waits for a click and calls function 'markUnComplete'
}) // Closes loop

async function deleteItem(){ // Declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of the list item and grabs only the inner text within the list span
    try{ // Starting a try block to do something
        const response = await fetch('deleteItem', { //Creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', // Sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // Specifyies the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content
              'itemFromJS': itemText // Setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // Closes the body
          }) // Closes the object
        const data = await response.json() // Waiting on JSON from the response to be converted
        console.log(data) // Log the result to the console
        location.reload() // Reloads the page to update what is displayed
        
    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // Logs the error to the console
    } // Closes the catch block
} // Ends the function


async function markComplete(){ // Declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of the list item and grabs only the inner text within the list span
    try{ // Starts a try clock to do something
        const response = await fetch('markComplete', { // Creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', // Setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, // Specifies the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content
                'itemFromJS': itemText // Setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // Closes the body
          }) // Closes the object
        const data = await response.json() // Waiting on JSON from the response to be converted
        console.log(data) // Log the result to the console
        location.reload() // Reloads the page to update what is displayed

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // Logs the error to the console
    } // Closes the catch block
} // Ends the function

async function markUnComplete(){ // Declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of the list item and grabs only the inner text within the list span
    try{ // Starts a try clock to do something
        const response = await fetch('markUnComplete', {  // Creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', // Setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, // Specifies the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content
                'itemFromJS': itemText // Setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // Closes the body
          }) // Closes the object
        const data = await response.json() // Waiting on JSON from the response to be converted
        console.log(data) // Log the result to the console
        location.reload() // Reloads the page to update what is displayed

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // Logs the error to the console
    } // Closes the catch block
} // Ends the function
