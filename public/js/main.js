const deleteBtn = document.querySelectorAll('.fa-trash') // Creating a variable and assigning it to a selection of all elements with the class of the trash can 
const item = document.querySelectorAll('.item span') // Creating a variable and assigning it to a selector of span tags with a parent that has a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // Creating a variable and assigning it to a selection of spans with a class of 'completed' inside of a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // add an event listener to the current item that waits for a click and then calls a function called deleteItem
}) // close out loop

Array.from(item).forEach((element)=>{  // creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click and then calls a function called markComplete
}) // close out loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // add an event listener to ONLY completed items.
}) // closing our loop

async function deleteItem(){ //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of the delete item
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) // closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//closes the catch block
} // end the function

async function markComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks indie of the list item and grabs only the inner text within the last span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a reponse variable that waits on a fetch to get data from the results of two markComplete route
            method: 'put', // setting the CRD methos to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object 
        const data = await response.json() //waiting on JSON from the response
        console.log(data) //log the error to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //closes the catch block
} // end the function

async function markUnComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks indie of the list item and grabs only the inner text within the last span
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a reponse variable that waits on a fetch to get data from the results of two markUnComplete route
            method: 'put', // setting the CRD methos to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) // end the function
        const data = await response.json() //waiting on JSON from the response
        console.log(data) //log the error to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//closes the catch block
}// end the function