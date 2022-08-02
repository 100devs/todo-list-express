const deleteBtn = document.querySelectorAll('.fa-trash') // Creates a varibale and assigning it to a selection of all elements with a class of the trash can 
const item = document.querySelectorAll('.item span') // Creates a variable and assigning it to a selection of span tags inside of a parent that has a class of item 
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ // Creates an array from our selection and loops
    element.addEventListener('click', deleteItem) // Adds an event listener to every element, on click will run function deleteItem
}) // close loop 

Array.from(item).forEach((element)=>{ // Creates an array from our selection and loops
    element.addEventListener('click', markComplete) // Adds an event listener to every element, on click will run function markComplete
}) // close loop

Array.from(itemCompleted).forEach((element)=>{ // Creates an array from our selection and loops
    element.addEventListener('click', markUnComplete) // Adds an event listener to ONLY completed items
}) // close loop

async function deleteItem(){ // Declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of list item and grabs only the inner text within the list span
    try{ // Starts a try block to complete a task
        const response = await fetch('deleteItem', { // Creates a response variable that waits on a fetch to get data from result of deleteItem route 
            method: 'delete', // Sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // Specifies the type of content expected, which is JSON
            body: JSON.stringify({ // Declares the message content being passed, and stringifies that content 
              'itemFromJS': itemText // Sets  the content of the body to the inner texts of the list item, and naming it 'itemFromJS'
            }) // Closing the body 
          }) // Closing the object
        const data = await response.json() // Waits on JSON from the response to be converted 
        console.log(data) // Logs data to console
        location.reload() // Refresh page to update what is displayed

    }catch(err){ // If error occurs, pass the error into the catch block
        console.log(err) // Logs error, if any
    } // Closes catch block 
} // Closing bracket for async function

async function markComplete(){ // Declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of list item and grabs only the inner text within the list span
    try{ // Starting a try block to do something
        const response = await fetch('markComplete', { // Creates a response variable that waits on a fetch to get data from result of markComplete route
            method: 'put', // Sets the CRUD method to UPDATE for the route
            headers: {'Content-Type': 'application/json'}, // Specifies the type of content expected, which is JSON
            body: JSON.stringify({ // Declares the message content being passed, and stringify that content
                'itemFromJS': itemText // Sets the content of the body to the inner texts of the list item, and naming it 'itemText'
            }) // Closes the body 
          }) // Closes the object 
        const data = await response.json() // Waits on JSON from the response to be converted
        console.log(data) // Logs data to console
        location.reload() // Refresh page to update what is displayed

    }catch(err){ // If error occurs, pass the error into the catch block
        console.log(err) // Logs error, if any 
    } // Closes catch block 
} // Closing bracket for async function 

async function markUnComplete(){ // Declares an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of list item and grabs only the inner text within the list span
    try{ // Starting a try block to do something
        const response = await fetch('markUnComplete', { // Creates a response variable that waits on a fetch to get data from result of markUnComplete route
            method: 'put', // Sets the CRUD method to UPDATE for the route 
            headers: {'Content-Type': 'application/json'}, // Specifies the type of content expected, which is JSON
            body: JSON.stringify({ // Declares the message content being passed, and stringify that content
                'itemFromJS': itemText // Sets the content of the body to the inner texts of the list item, and naming it 'itemText'
            }) // Closes the body 
          }) // Closes the object 
        const data = await response.json()// Waits on JSON from the response to be converted
        console.log(data) // Logs data to console
        location.reload() // Refresh page to update what is displayed

    }catch(err){ // If error occurs, pass the error into the catch block
        console.log(err) // Logs error, if any
    } // Closes catch block 
} // Closing bracket for async function
