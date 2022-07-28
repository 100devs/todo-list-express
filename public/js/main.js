const deleteBtn = document.querySelectorAll('.fa-trash') //Creating a variable and assigning it to a selection of all elements with a class of trash can
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of span tags inside of a parent that has a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of spans that have a class of "completed" what are inside a parent of a class "item"

Array.from(deleteBtn).forEach((element) => { //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //adding an eventlistener to the current item that waits for a click and runs the "deleteItem" function to delete the element in the array
}) //close the loop

Array.from(item).forEach((element) => { //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //adding an eventlistener to the current item that waits for a click and runs the "markComplete" function to run a line throught the text
}) //close the loop

Array.from(itemCompleted).forEach((element) => { //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adding an eventlistener to only completed item(s) that waits for a click and runs the "markUnComplete" function to remove line throught the text
}) //close the loop

async function deleteItem() { //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try { //Start a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route to "delete"
            headers: { 'Content-Type': 'application/json' }, //Specifiying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content (turn it into a string)
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
        })//closing the object and fect function parameter box
        const data = await response.json() //creating a variable data and setting it wait for the server to respond with json
        console.log(data) //console logging the server json respone
        location.reload() //reloading the page

    } catch (err) { //Starting an error handing block. If and error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markComplete() { //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try { //Start a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //set the CRUD method to 'update' for the route
            headers: { 'Content-Type': 'application/json' }, //Specifiying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content (turn it into a string)
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
        }) //closing the object and fect function parameter box
        const data = await response.json() //creating a variable data and setting it wait for the server to respond with json
        console.log(data) //console logging the server json respone
        location.reload() //reloading the page

    } catch (err) { //Starting an error handing block. If and error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markUnComplete() { //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try { //Start a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //set the CRUD method to 'update' for the route
            headers: { 'Content-Type': 'application/json' }, //Specifiying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content (turn it into a string)
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
        }) //closing the object and fect function parameter box
        const data = await response.json() //creating a variable data and setting it wait for the server to respond with json
        console.log(data) //console logging the server json respone
        location.reload() //reloading the page

    } catch (err) { //Starting an error handing block. If and error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function