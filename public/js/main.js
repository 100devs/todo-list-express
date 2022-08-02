const deleteBtn = document.querySelectorAll('.fa-trash') // Creating a variable and assinging it to a  selection of all elements with class of fa trash
const item = document.querySelectorAll('.item span') // Creating a variable and assigning it to a selection of span tags within a parent that have the class of item
const itemCompleted = document.querySelectorAll('.item span.completed') // Creating a variable and assinging it to a selection of spans with class of competed & a parent of item, 

Array.from(deleteBtn).forEach((element)=>{  // Create an array from our selection 'deleteBtn' and starting a loop 
    element.addEventListener('click', deleteItem) // Adding an event listener, listens for click, calls deleteItem fx
}) // Close our loop

Array.from(item).forEach((element)=>{ // Creating an array from selection 'item' , starting a loop, 
    element.addEventListener('click', markComplete) // Adds event listener, listens for click, calls markComplete fx
})

Array.from(itemCompleted).forEach((element)=>{ // Creating an array from selection 'itemCompleted' and starting a loop
    element.addEventListener('click', markUnComplete) // Adds event listener to completed items, listens for click, calls markUncomplete fx 
})

async function deleteItem(){ // declaring an asyncronous function 
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of list item and grabs only the inner text within the list span.
    try{ // Starting a try block to do something
        const response = await fetch  ('deleteItem', { // Creates a response variable that waits on a fetch to get data from the result of delete item route. 
            method: 'delete', // Sets the CRUD method for the route.
            headers: {'Content-Type': 'application/json'}, // Specifiying the type of content expected is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content. 
              'itemFromJS': itemText // setting the content of the body, to the inner text of the list item, and naming it 'item from JS'
            }) // Closing the body
          }) // Closing the object
        const data = await response.json() // waiting on JSON from the response
        console.log(data)// Log the result ot the console.
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // If an error occurs, pass the error into the catch block. 
        console.log(err) // Log the error to the console.
    } // Close Catch block
} // end the function

async function markComplete(){ // Declare an asychronous function 
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of list item and grabs only the inner text within the list span.
    try{ // Starting a try block to do something
        const response = await fetch('markComplete', { //  Creates a response variable that waits on a fetch to get data from the result of markComplete route. 
            method: 'put', // Setting the CRUD method to UPDATE for the route
            headers: {'Content-Type': 'application/json'}, // Specifyign the tyle of content expected which is json
            body: JSON.stringify({ // declare the message content being passed, and stringify that content. 
                'itemFromJS': itemText //  setting the content of the body, to the inner text of the list item, and naming it 'item from JS'
            })
          })
        const data = await response.json() // waiting on JSON from the response
        console.log(data) // Log the results to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){  // If an error occurs, pass the error into the catch block
        console.log(err) // log the erro to the console
    } // close the catch block
} // end the funciton

async function markUnComplete(){ // Declare an asyc fucntion
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of list item and grabs only the inner text within the list span. 
    try{ // Starting a try block to do something
        const response = await fetch('markUnComplete', { // Creates a response variable that waits on a fetch to get data from the result of markUnComplete route. 
            method: 'put', // Setting the CRUD method to Update for the route
            headers: {'Content-Type': 'application/json'}, // Specifyign the tyle of content expected which is json
            body: JSON.stringify({ // declare the message content being passed, and stringify that content. 
                'itemFromJS': itemText //  setting the content of the body, to the inner text of the list item, and naming it 'item from JS'
            }) // Closing the body
          }) // Closing the object

        const data = await response.json() // waiting on JSON from the response
        console.log(data) // Log the results to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // log the erro to the console
    } // Close the catch block
}   // Close the function