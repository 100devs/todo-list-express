const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of all elements with a class of 'fa-trash' aka the trash can icon
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of all span elements within a parent with the class 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of all span elements of class 'completed' with a parent with class 'item'

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our deleteBtn selection and starting a forEach loop through that array
    element.addEventListener('click', deleteItem) // add a click event listener to the current item and run function 'deleteItem'
}) // close our loop

Array.from(item).forEach((element)=>{ // creating an array from our item selection and starting a loop
    element.addEventListener('click', markComplete) // add a click event listener to the current item that calls function 'markComplete'
}) // close our loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our itemCompleted selection and starting a loop
    element.addEventListener('click', markUnComplete) // add a click event listener to ONLY completed items that calls function 'markUncomplete'
}) // close loop

async function deleteItem(){ // declare asynchronous function 'deleteItem'
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting off a try block to do something
        const response = await fetch('deleteItem', { // creating a response variable that waits on a fetch to get data from the result of deleteItem route, also opening an object bracket
            method: 'delete', // setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON in this case
            body: JSON.stringify({ // take the body (which is the message content that is being passed) and stringify that content/make that content a string 
              'itemFromJS': itemText // setting the content of the body to the innertext of the list item and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on the conversion of the response JSON
        console.log(data) // log the result to the console
        location.reload() // page refresh to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block as a parameter
        console.log(err) // log the error to the console
    }// close catch block
} // end function

async function markComplete(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // look inside of the list item and grab only the inner text within the list span
    try{ // declare a try block
        const response = await fetch('markComplete', { // create a response variable that waits on a fetch to get data from the result of the 'markComplete' route
            method: 'put', // setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifiying the type of content expected
            body: JSON.stringify({ // declare the message content being passed and stringify that content
                'itemFromJS': itemText // setting the content of the body to the innertext of the list item and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on the conversion of the response JSON
        console.log(data) // log the result to the console
        location.reload() // page refresh to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block as a parameter
        console.log(err) // log the error to the console
    } // close catch block
} // end function

async function markUnComplete(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // look inside of the list item and grab only the inner text within the list span
    try{ // declare a try block
        const response = await fetch('markUnComplete', { // create a response variable that waits on a fetch to get data from the result of the 'markUnComplete' route
            method: 'put', // setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifiying the type of content expected
            body: JSON.stringify({ // declare the message content being passed and stringify that content
                'itemFromJS': itemText // setting the content of the body to the innertext of the list item and naming it 'itemFromJS'
            }) // closing the body
        }) // closing the object
        const data = await response.json() // waiting on the conversion of the response JSON
        console.log(data) // log the result to the console
        location.reload() // page refresh to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block as a parameter
        console.log(err) // log the error to the console
    } // close catch block
} // end function