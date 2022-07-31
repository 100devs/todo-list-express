const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to all slections of all  elements with a class of the trash can 
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our slection and starting a loop
    element.addEventListener('click', deleteItem) // add an event listener to the current item that waits for a click and then calls a function called deleteItem
}) // close our loop

Array.from(item).forEach((element)=>{  // creating an array from our slection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click and then calls a function called markComplete
}) // close our loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our slection and starting a loop
    element.addEventListener('click', markUnComplete) // // add an event listener to only completed items that waits for a click and then calls a function called markUnComplete
}) // close our loop

async function deleteItem(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the innertext within the list span
    try{ //declaring a try block
        const response = await fetch('deleteItem', { // creating a response variable that waits on a fetch to get data from the results of deleteItem route
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifiying the type of content expected whis is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
              'itemFromJS': itemText // setting the content of the body to the inntertext of the list item and naming it "itemFromJS"
            })// closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the respon to be converted
        console.log(data) // log the results to the console
        location.reload() // reloading the page to update what is displayed

    }catch(err){ // if an error occurs, pass the rror into the catach block
        console.log(err) // log the rror in console
    } // close the catch block
} // end the function

async function markComplete(){ // decare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the innertext with the list span
    try{ // starting a try block
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of the markCOmplete route
            method: 'put', // setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the innertext of the list item and naming it itemFROMJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the respon to be converted
        console.log(data) // log the results to the console
        location.reload() // reloading the page to update what is displayed

    }catch(err){ // if an error occurs, pass the rror into the catach block
        console.log(err) // log the rror in console
    } // close the catch block
} // end the function

async function markUnComplete(){ // decare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the innertext with the list span
    try{ // starting a try block 
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', // setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the innertext of the list item and naming it itemFROMJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the respon to be converted
        console.log(data) // log the results to the console
        location.reload() // reloading the page to update what is displayed

    }catch(err){ // if an error occurs, pass the rror into the catach block
        console.log(err) // log the rror in console
    } // close the catch block
} // end the function