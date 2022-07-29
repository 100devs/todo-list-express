const deleteBtn = document.querySelectorAll('.fa-trash') // creates the deleteBtn variable and ties it to the .fa-trash class in the dom. Every time the deleteBtn variable is used, it will affect all items in index.ejs that have been given this class.
const item = document.querySelectorAll('.item span') // creates the item variable and ties it to all span elements within the .item parent class. ""
const itemCompleted = document.querySelectorAll('.item span.completed') // creates the itemComplete variable and ties it to all spans that have the .completed class that are within the .item parent class.

Array.from(deleteBtn).forEach((element)=>{ // Creates an array from all items tied to the deleteBtn variable (everything with the .fa-trash class) and beginning a loop through these items.
    element.addEventListener('click', deleteItem) // Adds an event listener to each of these items that is waiting on a click. Once it detects this click, it calls the deleteItem function.
}) // Closes the loop.

Array.from(item).forEach((element)=>{ // Creates an array from all items tied to the item variable(all the span tags within the item class) and beginning a loop through these items.
    element.addEventListener('click', markComplete) // Adds an event listener to each of these items that is waiting on a click. Once it detects this click, it calls the markComplete function.
}) // Closes the loop.

Array.from(itemCompleted).forEach((element)=>{ // Creates an array from all items tied to the itemCompleted variable (all the span tags with the completed class within the item class) and beginning a loop through these items.
    element.addEventListener('click', markUnComplete) // Adds an event listener to each of these items that is waiting on a click. Once it detects this click, it calls the markUnComplete function.
}) // Closes the loop.

async function deleteItem(){ // Creates an asynchronous function called deleteItem.
    const itemText = this.parentNode.childNodes[1].innerText // Creates a local variable called itemText which selects only the inner text within each span on the list. 
    try{ // starting a try block.
        const response = await fetch('deleteItem', { // creates the response constant, which uses the fetch API to await the result of the deleteItem route.
            method: 'delete', // sets the CRUD method for the route.
            headers: {'Content-Type': 'application/json'}, // Defining the content type of the route as JSON objects.
            body: JSON.stringify({ // turns the message part of the JSON object coming through this route into a string.
              'itemFromJS': itemText // uses the local variable that we defined on line 18 (itemText), takes the innerText, and names it 'itemFromJS'
            }) // closing the response body of the fetch.
          }) // closing the object created by the fetch.
        const data = await response.json() // waits on the response constant that we just created and then converts it to json
        console.log(data) // logs the result of this to the console.
        location.reload() // refreshes the page to update what is displayed.

    }catch(err){ // if an error occurs, it gets passed into this catch block as the err variable.
        console.log(err) // this err variable is then logged to the console.
    }// closes the catch block.
} // ends the function of deleteItem

async function markComplete(){ // creates an asynchronous function called markComplete.
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span.
    try{ // starting a try block to do something
        const response = await fetch('markComplete', { // creates another response constant that waits on a fetch to get data from the result of the markComplete route
            method: 'put', // setting the CRUD method to update for the route.
            headers: {'Content-Type': 'application/json'}, // Defining the content type of the route as JSON objects.
            body: JSON.stringify({ // turns the message part of the JSON object coming through this route into a string.
                'itemFromJS': itemText // uses the local variable that we defined on line 37 (itemText), takes the innerText, and names it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // creating a constant called data from the result of the data we get from the response constant that we just created that we then convert to json
        console.log(data) // logging that data to the console.
        location.reload() // refreshing the page to update the content.

    }catch(err){ // if an error occurs, pass the error into the catch block.
        console.log(err) // log the error to the console.
    } // close the catch block.
} // end the function of markComplete

async function markUnComplete(){ // creates an asynchronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of the markUnComplete function
            method: 'put', // sets the CRUD method as update for the route.
            headers: {'Content-Type': 'application/json'}, // defines the expected content as a json object.
            body: JSON.stringify({ // turns the body of this object into a string.
                'itemFromJS': itemText // names the itemText from 56 as 'itemFromJS'
            }) // closes the body
          }) // closes the object
        const data = await response.json() // waits on the JSON from the response to be converted
        console.log(data) // logs that data to the console.
        location.reload() // refreshes the page

    }catch(err){ // if any errors occur, they are caught here in the err parameter
        console.log(err) // logs that parameter
    } // closes the catch block
} // ends the markUnComplete function