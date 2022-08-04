const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selecting all elements with a class of the trash can
const item = document.querySelectorAll('.item span') // creating a variable and assinging it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assinging it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // add event listener to the current item that waits for a click and then calls a function called deleteItem
}) // close our loop

Array.from(item).forEach((element)=>{ // creating arry from our selction and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click and then calles a function called 'markComplete 
}) // close our loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // adds event listener to only completed items
}) // close our loop

async function deleteItem(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside list item and grabs only the inner text within the list span
    try{ // starting a try block to do something 
        const response = await fetch('deleteItem', { // create response variable that waits on a fetch to get data from the result of the deleteItems route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of cotent expevted (which is JSON)
            body: JSON.stringify({ // declare the message content being passed, abd stringify that content
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //closing body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log reulst into console
        location.reload() // refesh the page to update content displayed

    }catch(err){ // if error occurs, pass the error into the catch block
        console.log(err) // log error into console
    } // close catch block
} // end function

async function markComplete(){ // declare an asyncchronus function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markComplete', { // create response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', // setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},  // specifying the type of cotent expevted (which is JSON)
            body: JSON.stringify({ // declare the message content being passed, abd stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            })// closing body
          }) //closing object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log reulst into console
        location.reload() // refesh the page to update content displayed

    }catch(err){  // if error occurs, pass the error into the catch block
        console.log(err) // log error into console
    } // close catch block
} // end function

async function markUnComplete(){ // declare an asyncchronus function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { // create response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put',// setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of cotent expevted (which is JSON)
            body: JSON.stringify({// declare the message content being passed, abd stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //closing body
          }) // closing object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log reulst into console
        location.reload() // refesh the page to update content displayed


    }catch(err){ // if error occurs, pass the error into the catch block 
        console.log(err)// log error into console
    } // close catch block
} // end function