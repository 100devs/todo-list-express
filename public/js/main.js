const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable assigning it to a selection to all elements that have a class of .fa-trash 
const item = document.querySelectorAll('.item span')//creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item" 

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection of delete buttons and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click then calls a function called deleteItem
}) //close our loop

Array.from(item).forEach((element)=>{ //creating an array from the selection of a span with the parent class of item and starting a loop
    element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click and then calls a function called markComplete
}) //close the loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)//adds an event listener to ONLY completed items
}) //close the loop

async function deleteItem(){ //declaring an asyncrhronous function
    //looks inside of the list item and grabs only the inner text within the list span 
    const itemText = this.parentNode.childNodes[1].innerText
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from result of 'deleteItem' route
            method: 'delete', //sets the CRUD method tp 'delete' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //declare the message content being passed, and turning the JSON into a string
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //send a message back to the browser to update what is displayed
    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markComplete(){//declaring an asyncrhronous function
    const itemText = this.parentNode.childNodes[1].innerText  //looks inside of the list item and grabs only the inner text within the list span 
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from result of 'markComplete' route
            method: 'put', //sets the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //declare the message content being passed, and turning the JSON into a string
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //close the body
          }) //close the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //send a message back to the browser to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markUnComplete(){ //declaring an asyncrhronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span 
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from result of 'markUnComplete' route
            method: 'put', //sets the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //declare the message content being passed, and turning the JSON into a string
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //close the body
          }) //close the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //log the error to the console

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err)  //log the error to the console
    } //close the catch block
} //end the function   