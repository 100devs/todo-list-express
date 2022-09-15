const deleteBtn = document.querySelectorAll('.fa-trash') //Creating a variable and assigning it to a selection of all elements with a class of trash can
const item = document.querySelectorAll('.item span') //Creating a variable and assigning it to a selection of span tags inside of a partent with a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //Creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ //Creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //Adding an event listener to the current item that waits for a click and then calls a function called deleteItem
}) //Closing the loop

Array.from(item).forEach((element)=>{ //Creating an array from our selection and starting a loop 
    element.addEventListener('click', markComplete) //Adding an event listener to the current item that waits for a click and then calls a function called markComplete
}) //Closing the loop

Array.from(itemCompleted).forEach((element)=>{ //Creating an array from our selection and starting a loop 
    element.addEventListener('click', markUnComplete) //Adding an event listener to ONLY completed items
}) //Closing the loop

async function deleteItem(){ //Declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside of the list item and grabs only the inner text within the list span
    try{ //Declaring/starting a try block to do something
        const response = await fetch('deleteItem', { //Creating a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //Sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //Specifying the type of content expected, which is JSON
            body: JSON.stringify({ //Declare the message content being passed (with the body property) and stringify that content 
            'itemFromJS': itemText //Setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //Closing the body
        }) //Closing the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //Log the result to the console
        location.reload() //Reloads the page to update what is displayed

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //Log the error to the console
    } //Close the catch block
} //End the function

async function markComplete(){ //Declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside of the list item and grabs only the inner text within the list span
    try{ //Declaring/starting a try block to do something
        const response = await fetch('markComplete', { //Creating a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //Setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //Specifying the type of content expected, which is JSON
            body: JSON.stringify({ //Declare the message content being passed (with the body property) and stringify that content 
                'itemFromJS': itemText //Setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //Closing the body
        }) //Closing the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //Log the result to the console
        location.reload() //Reloads the page to update what is displayed

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //Log the error to the console
    } //Close the catch block
} //End the function

async function markUnComplete(){ //Declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside of the list item and grabs only the inner text within the list span
    try{ //Declaring/starting a try block to do something
        const response = await fetch('markUnComplete', { //Creating a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //Setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //Specifying the type of content expected, which is JSON
            body: JSON.stringify({ //Declare the message content being passed (with the body property) and stringify that content 
                'itemFromJS': itemText //Setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //Closing the body
        }) //Closing the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //Log the result to the console
        location.reload() //Reloads the page to update what is displayed

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //Log the error to the console
    } //Close the catch block
} //End the function