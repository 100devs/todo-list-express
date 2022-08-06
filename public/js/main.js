const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable called deleteBtn and assigning it to a selection of all elements with the class of fa-trash
const item = document.querySelectorAll('.item span') //creates a variable called item and assigning it to a selection of all span tags inside a parent that has a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creates a variable called itemCompleted and assigning it to a selection of all span tags with a class of completed inside a parent that has a class of item 

Array.from(deleteBtn).forEach((element)=>{ //creates an array from our selection and starts a loop
    element.addEventListener('click', deleteItem) //adds event listener to the current item that waits for a click and then calls a function called deleteItem
}) //close the loop

Array.from(item).forEach((element)=>{ //create an array from our selection and start a loop
    element.addEventListener('click', markComplete) //add event listener to the current item that waits for a click and calls a function called markComplete
}) //close the loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //add an event listener to ONLY completed items
}) //close our loop

async function deleteItem(){ //declare asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText //sets a variable called itemText to be the text value of the specified list item
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creating a variable called response that waits on a fetch to get data from the result of deleteItem
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify it
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) //closing the body
          }) //closing the object
        const data = await response.json() //creating a variable called data that waits on the server to respond with JSON
        console.log(data) //logs the data to the console
        location.reload() //refreshes the page

    }catch(err){ //closes the try block and starts a catch block so that if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //closes the catch block
} //closes the function

async function markComplete(){ //declare asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText //sets a variable called itemText to be the text value of the specified list item
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creating a variable called response that waits on a fetch to get data from the result of deleteItem
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify it
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) //closing the body
          }) //closing the object
        const data = await response.json() //creating a variable called data that waits on the server to respond with JSON
        console.log(data) //logs the data to the console
        location.reload() //refreshes the page

    }catch(err){ //closes the try block and starts a catch block so that if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //closes the catch block
} //closes the function

async function markUnComplete(){ //declare asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText //sets a variable called itemText to be the text value of the specified list item
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creating a variable called response that waits on a fetch to get data from the result of deleteItem
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify it
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) //closing the body
          }) //closing the object
        const data = await response.json() //creating a variable called data that waits on the server to respond with JSON
        console.log(data) //logs the data to the console
        location.reload() //refreshes the page

    }catch(err){ //closes the try block and starts a catch block so that if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //closes the catch block
} //closes the function