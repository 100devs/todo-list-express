const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable with all elements with noted class - trash cans
const item = document.querySelectorAll('.item span') //Creating a variable of elements with noted class - all spans with a parent with class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //Creating a variable of spans with a class of completed within a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{ // Creating  a for each loop for an array created from the delete button
    element.addEventListener('click', deleteItem) //Adding an event listener to the current element and when clicked running the function noted - deleting item on click of icon
}) //Closing our loop

Array.from(item).forEach((element)=>{ // Creating  a for each loop for an array created from the items
    element.addEventListener('click', markComplete) //Adding an event listener to the current element and when clicked running the function noted - makes uncompleted completed on click
}) //Closing our loop

Array.from(itemCompleted).forEach((element)=>{ // Creating a for each loop for an array created from the items which are completed
    element.addEventListener('click', markUnComplete) //Adding an event listener to the current element and when clicked running the function noted - makes completed uncompleted on click
})

async function deleteItem(){ //Declare asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //Creating a variable from some inner text from EJS - for specified list item - next to trashcan
    try{ //Declaring a try block to do something
        const response = await fetch('deleteItem', { //Creating a response variable waiting on a fetch to get data from result of delete item route
            method: 'delete', //Sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //Specifying type of content expected - json
            body: JSON.stringify({ //Declare the message content being passed and making it into json
              'itemFromJS': itemText //Setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) //Closing the body
          }) //Closing the object
        const data = await response.json()  //Waiting on JSON from the response to be converted
        console.log(data) //Log the data to the console
        location.reload() //Reloads the page to update what is displayed

    }catch(err){ //If an error occurs pass the error into this catch block
        console.log(err) //Log the error to the console
    } //Closes the catch block
} //Ends the function

async function markComplete(){ //declare an async function 
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside of the list item and grabs only the inner text within the list
    try{ //Declaring a try block to do something
        const response = await fetch('markComplete', { // Creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //setting the crud method to update for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected  which is JSON
            body: JSON.stringify({ //Declare the message content being passed and making it into json
                'itemFromJS': itemText //Setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) //Closing the body
          }) //Closing the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //Log the data to the console
        location.reload() //Reloads the page to update what is displayed

    }catch(err){ //If an error occurs pass the error into this catch block
        console.log(err) //Log the error to the console
    } //Closes the catch block
} //Ends the function

async function markUnComplete(){ //declare an async function 
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside of the list item and grabs only the inner text within the list
    try{ //Declaring a try block to do something
        const response = await fetch('markUnComplete', { // Creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //setting the crud method to update for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected  which is JSON
            body: JSON.stringify({  //Declare the message content being passed and making it into json
                'itemFromJS': itemText //Setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) //Closing the body
          }) //Closing the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //Log the data to the console
        location.reload() //Reloads the page to update what is displayed

    }catch(err){ //If an error occurs pass the error into this catch block
        console.log(err) //Log the error to the console
    } //Closes the catch block
} //Ends the function