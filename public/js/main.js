const deleteBtn = document.querySelectorAll('.fa-trash')// Creating a constant variable; selecting all elements with the class of fa-trash and assinging to the deleteBtn variable
const item = document.querySelectorAll('.item span')// Creating a constant variable of item; selecting all elements with the class of item and all spans inside that element with the item; assigning to item
const itemCompleted = document.querySelectorAll('.item span.completed')//Creating const variable; selecting all elements with the class of item and all spans with the class of span.completed

Array.from(deleteBtn).forEach((element)=>{ //Creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // add an event listener to our current item; listen for a click and calls a function deleteItem
})//closed the loop

Array.from(item).forEach((element)=>{//Creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete)// add an event listener to our current item; listen for a click and calls a function markComplete
})// Closed the loop

Array.from(itemCompleted).forEach((element)=>{//Creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)// add an event listener to our current item; listen for a click and calls a function markUnComplete
})// Closed the loop

async function deleteItem(){ // Creating an async function of deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // Start of a try block
        const response = await fetch('deleteItem', { // creating a response variable that waits on a fetch to get data from the result of the deleteitem route
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //declare the message content being passed and turn it into a string
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemFromJS
            })//closing body
          })//closing the object
        const data = await response.json() // waiting for the server to respond with some JSON to be converted
        console.log(data) // log the result to the console.
        location.reload() // refreshes the page to update the data being displayed

    }catch(err){ // catch errors if there are any errors
        console.log(err)// logs the error if there is any
    }// closes catch block
}//closes async function

async function markComplete(){ //declare async function
    const itemText = this.parentNode.childNodes[1].innerText //selecting the innertext of the selected element
    try{ //try block
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch from the markComplete route
            method: 'put', // setting a CRUD method to update 
            headers: {'Content-Type': 'application/json'},// specifying the type of content expected
            body: JSON.stringify({ // declare the message content being passed and turning into a string
                'itemFromJS': itemText // setting the content of the body to the innerText of the list item and naming it itemFromJS
            })//close body
          })//close object
        const data = await response.json() //waiting for the JSON from the response to be converted
        console.log(data) // log the data
        location.reload() // refresh the page to display updated 

    }catch(err){ // catch error if there's any
        console.log(err) // log erors if any
    }
}

async function markUnComplete(){ //async function
    const itemText = this.parentNode.childNodes[1].innerText // selecting the innerText of the selected element 
    try{// declare try block
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch from the markUnComplete route
            method: 'put',// setting a CRUD method to update 
            headers: {'Content-Type': 'application/json'},// specifying the type of content expected
            body: JSON.stringify({// declare the message content being passed and turning into a string
                'itemFromJS': itemText// setting the content of the body to the innerText of the list item and naming it itemFromJS
            })
          })
        const data = await response.json()//waiting for the JSON from the response to be converted
        console.log(data) // log the data
        location.reload()// refresh the page to display updated 

    }catch(err){// catch error if there's any
        console.log(err)// log erors if any
    }
}