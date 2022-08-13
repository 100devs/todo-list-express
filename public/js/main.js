const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection all elements with the class of the trash can 
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of span tags inside of a parent that  has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // reacting a variable and assigning it to a selection of spans that have the class of item and completed

Array.from(deleteBtn).forEach((element)=>{ // creates an array from deleteBtn and looping through each element
    element.addEventListener('click', deleteItem) //add an event listener to the current item when we click on the element it calls a function called deleteItem
}) // close our loop

Array.from(item).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to the current item when we click on the element it calls a function called markComplete
}) // close our loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // add an event listener to the span with a class of item and completed when we click on the element it calls a function called markUnComplete
}) // close our loop

//clicking delete does have both the deleteItem and markComplete functions called - you can actually see both requests both in the server terminal + network tab. Same happens when you click a completed task, both markComplete and markUnComplete - in that order.

async function deleteItem(){ // declaring an asynchronus function 
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span.
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { //creates a variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declate the message content being passed, and strigify that content
              'itemFromJS': itemText //setting the content of the body, 
            }) //closing the body
          })//closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //logging the error to the console
    } //close the catch block
} //close the function

async function markComplete(){ //declare an asynchronus function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs onlyy the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a variable that waits on a fetch to get data from the results of the markComplete route
            method: 'put', //sets the CRUD method to update for the route put means update
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming 
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //logging the error to the console
    }  //close the catch block
}//close the function 

async function markUnComplete(){ //declaring an asyncrhonus function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a variable that waits on a fetch to get data from the results of the markUnComplete route
            method: 'put', //sets the CRUD method to update for the route, put means update
            headers: {'Content-Type': 'application/json'}, //specifying the type content expected, which is JSON
            body: JSON.stringify({ //declare the message content begin passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //lof the result to the console
        location.reload() //reloads teh page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // logging the error to the console
    } //close the catch block
} //close the function