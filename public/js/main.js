const deleteBtn = document.querySelectorAll('.fa-trash') //Creates a variable and assigns it to a selection all elements with a class of the trash can icon
const item = document.querySelectorAll('.item span') //Creates a variable and assigns it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //Creates a variable and assigns it to a selection of spans with a class of "complete" inside of a parent with a class of "item

Array.from(deleteBtn).forEach((element)=>{ //Creates an ARRAY from the selection and starts loop
    element.addEventListener('click', deleteItem) //Adds an event listener to the current item that waits for a click and then calls a function deleteItem
}) //Closes our loop

Array.from(item).forEach((element)=>{ //Creates an ARRAY from the selection and starts loop
    element.addEventListener('click', markComplete) //Adds an event listener to the current item that waits for a click and then calls a function markComplete
}) //Closes our loop

Array.from(itemCompleted).forEach((element)=>{ //Creates an ARRAY from the selection and starts loop
    element.addEventListener('click', markUnComplete) //Adds an event listener to the current item that waits for a click and then calls a function markComplete
}) //Closes our loop

async function deleteItem(){ //Declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside the list item and grabs only the inner text within the list span
    try{ //Starts a TRY block to do something
        const response = await fetch('deleteItem', { //Creats a response variable that waits on a fetch to get data from the result of deleteItem
            method: 'delete', //Sets the CRUD method to delete for the route
            headers: {'Content-Type': 'application/json'}, // Sepcifies the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and strigify that content
              'itemFromJS': itemText //Sets the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //Closes the body
          }) //Closes the object
        const data = await response.json() //Waits on JSON from the response
        console.log(data) //Logs the result to the console
        location.reload() //reloads the page to update what is displaying

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //Logs the error to the console
    } //Closes the CATCH block
} //Closes the function

async function markComplete(){ //Declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside the list item and grabs only the inner text within the list span
    try{ //Starts a TRY block to do something
        const response = await fetch('markComplete', { //Creats a response variable that waits on a fetch to get data from the result of markCompplete
            method: 'put', //Sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // Sepcifies the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and strigify that content
                'itemFromJS': itemText //Sets the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //Closes the body
          }) //Closes the object
        const data = await response.json() //Waits on JSON from the response
        console.log(data) //Logs the result to the console
        location.reload() //reloads the page to update what is displaying

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //Logs the error to the console
    } //Closes the CATCH block
} //Closes the function

async function markUnComplete(){ //Declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside the list item and grabs only the inner text within the list span
    try{ //Starts a TRY block to do something
        const response = await fetch('markUnComplete', { //Creats a response variable that waits on a fetch to get data from the result of markUnCompplete
            method: 'put', //Sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // Sepcifies the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and strigify that content
                'itemFromJS': itemText //Sets the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //Closes the body
          }) //Closes the object
        const data = await response.json() //Waits on JSON from the response
        console.log(data) //Logs the result to the console
        location.reload() //reloads the page to update what is displaying

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //Logs the error to the console
    } //Closes the CATCH block
} //Closes the function