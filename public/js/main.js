const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of all elements with the class of fa-trash
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of all span tags that have a parent with the class of item
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of span tags that have a class of completed and within a parent with the class of item 

Array.from(deleteBtn).forEach((element)=>{ // creating an array from deleteBtn and iterating through each element with forEach
    element.addEventListener('click', deleteItem) // add event listener to current item (of array); listens for a click and calls a function called deleteItem
}) // close loop 

Array.from(item).forEach((element)=>{ // creating an array from a list of spans and iterating through each element with forEach
    element.addEventListener('click', markComplete) // add event listener to current item (of array); listens for a click and calls a function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{ // creating an array from completed spans and iterating through each element with forEach
    element.addEventListener('click', markUnComplete) // add event listener to only completed items; listens for a click and calls a function called markUnComplete
})

async function deleteItem(){ // declare an asynchronous function (change flow of execution - allow for other tasks to run)
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item to extract the text value only of the specified list item
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) // closing the body
          }) //closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log data to the console
        location.reload() // refreshes page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log error to the console
    } // close catch block
} // end the function

async function markComplete(){ // declare an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item to extract the text value only of the specified list item
    try{ // starting a try block to do something 
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', // sets the CRUD method for the route - put is update
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify the content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log data to the console
        location.reload() // refreshes page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log error to the console
    } // close catch block 
} // end the function

async function markUnComplete(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item to extract the text value only of the specified list item
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put', // sets the CRUD method to put (update)
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify the content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log data to the console
        location.reload() // refreshes page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the result to the console
    } // close the catch block
} // close the function