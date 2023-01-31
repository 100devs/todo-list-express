const deleteBtn = document.querySelectorAll('.fa-trash') //creates variable and assigning to a selection of all elements with a class of trash can
const item = document.querySelectorAll('.item span') //creates variable and assigns it to all span tags inside a parent element w class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creates variable and assigns it to all spans with class of completed inside parent element with class of item

Array.from(deleteBtn).forEach((element)=>{ //creates an array from the deleteBtn variable above and starts a loop
    element.addEventListener('click', deleteItem) //adds an event listener to current item that waits for a click.  Once it clicks, it calls the function called deleteItem
}) //closes the loop

Array.from(item).forEach((element)=>{ //creates an array from the item variable above and starts a loop
    element.addEventListener('click', markComplete) //adds an event listener to current item that waits for a click.  Once it clicks, it calls the function called markComplete
}) //closes the loop

Array.from(itemCompleted).forEach((element)=>{ //creates an array from the itemCompleted variable above and starts a loop (only items that are completed)
    element.addEventListener('click', markUnComplete) //adds an event listener to completed items only that waits for a click.  Once it clicks, it calls the function called markUnComplete
}) //closes the loop

async function deleteItem(){ //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looking inside the text inside a list item and grabs only the innerText within the list span
    try{ //starts a try block
        const response = await fetch('deleteItem', { //starts an obj and creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', // sets the CRUD method of DELETE for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //declares the message content being passed and stringify that content 
              'itemFromJS': itemText //setting content of the body to the innerTExt of the list item and naming it itemFromJS
            }) //closeing the body
          }) //closing the object
        const data = await response.json() //waiting for JSON from the response to be converted  
        console.log(data) //console log the result
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //console log the error
    } //close the catch block
} //close the function

async function markComplete(){ //declaring an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //looking inside the text inside a list item and grabs only the innerText within the list span
    try{ //starts a try block
        const response = await fetch('markComplete', { //starts an obj and creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', // sets the CRUD method of PUT for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //declares the message content being passed and stringify that content 
                'itemFromJS': itemText //setting content of the body to the innerTExt of the list item and naming it itemFromJS
            })//closeing the body
          })//closing the object
        const data = await response.json() //waiting for JSON from the response to be converted  
        console.log(data) //console log the result
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //console log the error
    } //close the catch block
} //close the function

async function markUnComplete(){//declaring an asynchronous function alled markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //looking inside the text inside a list item and grabs only the innerText within the list span
    try{ //starts a try block
        const response = await fetch('markUnComplete', { //starts an obj and creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', // sets the CRUD method of PUT for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //declares the message content being passed and stringify that content 
                'itemFromJS': itemText //setting content of the body to the innerTExt of the list item and naming it itemFromJS
            })//closeing the body
          })//closing the object
        const data = await response.json() //waiting for JSON from the response to be converted  
        console.log(data) //console log the result
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //console log the error
    } //close the catch block
} //close the function