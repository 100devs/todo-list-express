const deleteBtn = document.querySelectorAll('.fa-trash')                // create a variable, assign it all elements with a class of the trash can icon
const item = document.querySelectorAll('.item span')                    // create a variable, assign it all span elements inside of parents with a .item class
const itemCompleted = document.querySelectorAll('.item span.completed') // create a variable, it to a selection of spans with a class of 'completed' inside of a parent with a .item class

Array.from(deleteBtn).forEach((element)=>{                              // create an array from the elements with the trash can icon and loop through them
    element.addEventListener('click', deleteItem)                       // add an event listener to the current item and calls a 'deleteItem' function
})                                                                      // close our loop

Array.from(item).forEach((element)=>{                                   // create an array from the elements from our selection and loop through them
    element.addEventListener('click', markComplete)                     // add an event listener to the current item and call the function 'markComplete'
})                                                                      // close our loop

Array.from(itemCompleted).forEach((element)=>{                          // create an array from the elements from our selection and loop through them
    element.addEventListener('click', markUnComplete)                   // add an event listener to only completed items
})                                                                      // close our loop

async function deleteItem(){                                            // declare an async function to DELETE (delete) a task item
    const itemText = this.parentNode.childNodes[1].innerText            // looks inside of the list item and grabs only in inner text within list span
    try{                                                                // try block to attemp an action
        const response = await fetch('deleteItem', {                    // creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete',                                           // telling the server - sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},              // specifying the type of content expected, which is JSON
            body: JSON.stringify({                                      // declare the message content being passed in with the request, and stringify that content
                'itemFromJS': itemText                                  // setting the content of the body to the inner text of the inner item, and naming it 'itemFromJS'
            })                                                          // closing the body
        })                                                              // closing the object
        const data = await response.json()                              // waiting on JSON from the response to be converted
        console.log(data)                                               // print the JSON data to the console
        location.reload()                                               // page reload so updated DB information is loaded on the page

    }catch(err){                                                        // catch block for error handling, if error occurs, pass error into the catch block
        console.log(err)                                                // print the error to the console
    }                                                                   // close the catch block
}                                                                       // close the function

async function markComplete(){                                          // declare an async function to UPDATE (PUT)
    const itemText = this.parentNode.childNodes[1].innerText            // looks inside of the list item and grabs only the inner text within the list span
    try{                                                                // starting a try block to do something
        const response = await fetch('markComplete', {                  // creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put',                                              // setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},              // specifying the type of content expected, which is JSON
            body: JSON.stringify({                                      // declare them essage content being passed, and stringify that content
                'itemFromJS': itemText                                  // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })                                                          // closing the body
        })                                                              // closing the object
        const data = await response.json()                              // waiting on JSON form the response to be converted
        console.log(data)                                               // log the result to the console
        location.reload()                                               // reloads the page to update what is displayed

    }catch(err){                                                        // if an error occurs, pass the error into the catch block
        console.log(err)                                                // lof the error to the console
    }                                                                   // close the catch block
}                                                                       // end of the function

async function markUnComplete(){                                        // declare an async function
    const itemText = this.parentNode.childNodes[1].innerText            // looks inside of the list item and grabs only the inner text within the list span
    try{                                                                // starting a try block to do something
        const response = await fetch('markUnComplete', {                // creates a response variable that waits on a fetch to get data from the result of the markUncomplete route
            method: 'put',                                              // setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},              // specifying the type of content expected, which is JSON
            body: JSON.stringify({                                      // declare them essage content being passed, and stringify that content
                'itemFromJS': itemText                                  // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })                                                          // closing the body
        })                                                              // closing the object
        const data = await response.json()                              // waiting on JSON form the response to be converted
        console.log(data)                                               // log the result to the console
        location.reload()                                               // reloads the page to update what is displayed

    }catch(err){                                                        // if an error occurs, pass the error into the catch block
        console.log(err)                                                // lof the error to the console
    }                                                                   // close the catch block
}                                                                       // end of the function