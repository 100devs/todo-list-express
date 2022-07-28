const deleteBtn = document.querySelectorAll('.fa-trash') // creates a variable that selects all elements with a class of .fa-trash
const item = document.querySelectorAll('.item span') // creates a variable that selects all span tags inside of a parent with a class of .item
const itemCompleted = document.querySelectorAll('.item span.completed') // creates a variable that selects all spans with a class of .completed that are within a parent with a class of .item

Array.from(deleteBtn).forEach((element)=>{ // createing an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // adds an event listener to each element in the array, which listens for a click event, and runs the deleteItem function
}) // end of loop

Array.from(item).forEach((element)=>{ // createing an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // adds an event listener to each element in the array, which listens for a click event, and runs the markComplete function
}) // end of loop

Array.from(itemCompleted).forEach((element)=>{ // create an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // adds an event listener to only completed items, which listens for a click event, and runs the markUnComplete function
}) // end of loop

async function deleteItem(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { // creates a response varibable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
              'itemFromJS': itemText // setting the content of the body to the innter text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data)  // log the data to the console
        location.reload() // refreshes the page
 
    }catch(err){ // start of catch block, if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // end of catch block
} // end of asynchronous function

async function markComplete(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markComplete', { // creates a response varibable that waits on a fetch to get data from the result of deleteItem route
            method: 'put', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the innter text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // refreshes the page

    }catch(err){ // start of catch block, if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // end of catch block
} // end of asynchronous function

async function markUnComplete(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { // creates a response varibable that waits on a fetch to get data from the result of deleteItem route
            method: 'put', //  sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the innter text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() //  waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // refreshes the page

    }catch(err){ // start of catch block, if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // end of catch block
} // end of asynchronous function