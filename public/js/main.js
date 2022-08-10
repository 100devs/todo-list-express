const deleteBtn = document.querySelectorAll('.fa-trash') // creates a variable and assigning it to a selection of all elements with the class of the trash can
const item = document.querySelectorAll('.item span') // creates a variable and assigning it to a selection of of span tags inside of a parent that has a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // creates a variable and assigning it to a selection of spans with a class of 'completed' inside of a parent wiht a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // creates an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)  // add an event listener to the current item that waits for a click - once it has been licked, the function called 'deleteItem'
}) // closes the loop

Array.from(item).forEach((element)=>{ // creates an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click, and calls a function called 'markComplete'
})  // closes the loop

Array.from(itemCompleted).forEach((element)=>{  // creates an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)  // add an event listener to the current item that waits for a click, and calls a function called 'markUnComplete'
}) // closes the loop

async function deleteItem(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', // sets the CRUD method for the route, which is delete
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify the content
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item, naming it 'itemFromJS'
            }) // closes the body
          }) // closes the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // logs the data (server response) to the console
        location.reload() // reloads the page the user is on to update what is displayed

    }catch(err){ // if error occurs, pass the error into the catch block
        console.log(err) // logs the error to the console
    } // closes the catch block
} // ends the function

async function markComplete(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of the markComplete route 
            method: 'put', // sets the CRUD method for the route, which is update
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify the content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, naming it 'itemFromJS'
            }) // closes the body
          }) // closes the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // logs the data (server response) to the console
        location.reload() // reloads the page the user is on to update what is displayed

    }catch(err){ // if error occurs, pass the error into the catch block
        console.log(err) // logs the error to the console
    } // closes the catch block
} // ends the function

async function markUnComplete(){  // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block
        const response = await fetch('markUnComplete', {// creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', // sets the CRUD method for the route, which is update
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify the content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, naming it 'itemFromJS'
            }) // closes the body
          }) // closes the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) // logs the data (server response) to the console
        location.reload() // reloads the page the user is on to update what is displayed

    }catch(err){ // if error occurs, pass the error into the catch block
        console.log(err) // logs the error to the console
    } // closes the catch block
} // ends the function