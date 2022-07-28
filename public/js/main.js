const deleteBtn = document.querySelectorAll('.fa-trash') // declaring a variable and assigning it to a selection of all elements with a class of trash can font awesome icon 
const item = document.querySelectorAll('.item span') // delcaring a variable and assigning it to any span elements with the class item 
const itemCompleted = document.querySelectorAll('.item span.completed') //declaring a variable and assigning it to a selection of elements with the class item, that are also span element with the class completed

Array.from(deleteBtn).forEach((element)=>{ // creating an array from the deleteBtn variable, having each element selected being an element in the array and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click and then calls a function called declaration
}) //close our loop

Array.from(item).forEach((element)=>{ //creating an array from the item variable selection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to each element, that listens for a click and calls a function called markComplete
}) //close our loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from the itemCompleted variable selection and starting a loop
    element.addEventListener('click', markUnComplete) // add an event listener to each element, that listens for a click and calls a function called markUnComplete
}) // close our loop

async function deleteItem(){ //declaring an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ // declaring a try block, allows us to run something
        const response = await fetch('deleteItem', { //creating a response variable, that makes a fetch request to our API server and waits for data, retrieving data from the result of the deleteItem route.
            method: 'delete', // setting the crud method for the route
            headers: {'Content-Type': 'application/json'}, // telling the server to send back data in json format
            body: JSON.stringify({ //declare the info/content being passed and stringify that content
              'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it itemFromJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // logging the data we retrieved to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // starting a catch block for error handling, if an error occurs pass it into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // end + close the function

async function markComplete(){ //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ // declaring a try block, allows us to run something
        const response = await fetch('markComplete', { //creating a response variable, that makes a fetch request to our API server and waits for data, retrieving data from the result of the markComplete route.
            method: 'put', // setting the CRUD method to Update for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it itemFromJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) //logging the data we retrieved to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // starting a catch block from error handling, if an error occurs pass it into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // end close the function

async function markUnComplete(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // declaring a try block, allows us to run something
        const response = await fetch('markUnComplete', { // creating a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', // setting the CRUD method to Update for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
                'itemFromJS': itemText // setting the content of the body to the innerText of the list item and naming it itemFromJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // logging the data we retrieved to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // starting a catch block from erro rhandling, if an error occurs pass it into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // close the function