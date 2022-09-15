const deleteBtn = document.querySelectorAll('.fa-trash')    // Creating VARIABLE; ASSIGNING to it, a selection of all ELEMENTS with a class of TRASH-CAN.
const item = document.querySelectorAll('.item span')    // Creating VARIABLE; ASSIGNING to it, a selection of SPAN tags inside of a PARENT that has a CLASS of "ITEM".
const itemCompleted = document.querySelectorAll('.item span.completed') // Creating VARIABLE; ASSIGNING to it, a selection of SPAN tags, WITH a CLASS of "COMPLETED", inside of a PARENT that has a CLASS of "ITEM".

Array.from(deleteBtn).forEach((element)=>{  // Creating an array from our selection and starting a LOOP
    element.addEventListener('click', deleteItem)  // Add an EVENTLISTENER to the CURRENT item; it waits for a CLICK; then calls for a FUNCTION called DELETEITEM.
})  // close our LOOP

Array.from(item).forEach((element)=>{   // CREATE an ARRAY from our SELECTION and starts a LOOP
    element.addEventListener('click', markComplete) // ADD EVENTLISTENER to the CURRENT item that waits for a CLICK and then calls a FUNCTION called MARK_COMPLETE
})  // Close our LOOP

Array.from(itemCompleted).forEach((element)=>{  // Create an ARRAY from our SELECTION and starting a LOOP
    element.addEventListener('click', markUnComplete)   // ADD EVENTLISTER to ONLY completed items
})  // Close our LOOP

async function deleteItem(){    // declaring an ASYNCHRONOUS function
    const itemText = this.parentNode.childNodes[1].innerText    // looks inside of the item and grabs only the innerTEXT within the list span.
    try{    // Starting a TRY BLOCK to do something.
        const response = await fetch('deleteItem', {    // Creates a RESPONSE VARIABLE that waits on a FETCH to get DATA from the result of the DELETEITEM ROUTE.
            method: 'delete',   // Sets the 'DELETE' CRUD method for the ROUTE
            headers: {'Content-Type': 'application/json'},  // Specify the type of CONTENT expected, which is JSON
            body: JSON.stringify({  // Declare the message content being passed, and STRINGIFY that content.
              'itemFromJS': itemText    // Setting the content of the body to teh innertext of the list item, and naming it 'ITEMSFROM JS'
            })  // closing the body
          })    // closing our object
        const data = await response.json()  // Waiting on JSON from the response to be converted
        console.log(data)   // log the result to the CONSOLE
        location.reload()   // Reloads the page to UPDATE what is displayed.

    }catch(err){    // If an error occurs, pass the error into the CATCH block
        console.log(err)    // log the error to the CONSOLE
    }   // Close the CATCH block
}   // End the FUNCTION block

async function markComplete(){  // Declaring an ASYNC function called 'MARKCOMPLETE"
    const itemText = this.parentNode.childNodes[1].innerText    // looks inside of the item and grabs only the innerTEXT within the list span.
    try{    // Starting a TRY block to do something
        const response = await fetch('markComplete', {  // Declaring a RESPONSE VARIABLE and AWAITING a FETCH, but it's on a different ROUTE ('MARKCOMPLETE')
            method: 'put',  // Setting the 'UPDATE' CRUD method for the ROUTE.
            headers: {'Content-Type': 'application/json'},  // Specify the type of CONTENT expected, which is JSON
            body: JSON.stringify({  // Setting a BODY object and STRINGIFYING it; Declare the message content being passed, and STRINGIFY that content.
                'itemFromJS': itemText    // Setting the content of the body to the innertext of the list item, and naming it 'ITEMSFROM JS'
            })   // Close the CATCH block
          })   // End the FUNCTION block
        const data = await response.json()  // Waiting on JSON from the response to be converted
        console.log(data)   // log the result to the CONSOLE
        location.reload()   // Reloads the page to UPDATE what is displayed.

    }catch(err){    // If an error occurs, pass the error into the CATCH block
        console.log(err)    // log the error to the CONSOLE
    }   // Close the CATCH block
}   // End the FUNCTION block

async function markUnComplete(){  // Declaring an ASYNC function called 'MARKunCOMPLETE"
    const itemText = this.parentNode.childNodes[1].innerText    // looks inside of the item and grabs only the innerTEXT within the list span.
    try{    // Starting a TRY block to do something
        const response = await fetch('markUnComplete', {  // Declaring a RESPONSE VARIABLE and AWAITING a FETCH, but it's on a different ROUTE ('MARKunCOMPLETE')
            method: 'put',  // Setting the 'PUT' CRUD method for the ROUTE.
            headers: {'Content-Type': 'application/json'},  // Specify the type of CONTENT expected, which is JSON
            body: JSON.stringify({  // Setting a BODY object and STRINGIFYING it; Declare the message content being passed, and STRINGIFY that content.
                'itemFromJS': itemText    // Setting the content of the body to the innertext of the list item, and naming it 'ITEMSFROM JS'
            })   // Close the CATCH block
          })   // End the FUNCTION block
        const data = await response.json()  // Waiting on JSON from the response to be converted
        console.log(data)   // log the result to the CONSOLE
        location.reload()   // Reloads the page to UPDATE what is displayed.

    }catch(err){    // If an error occurs, pass the error into the CATCH block
        console.log(err)    // log the error to the CONSOLE
    }   // Close the CATCH block
}   // End the FUNCTION block