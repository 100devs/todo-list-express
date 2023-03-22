const deleteBtn = document.querySelectorAll('.fa-trash') // creates a variable that stores all elements with a class of "fa-trash" (from the index.ejs file)
const item = document.querySelectorAll('.item span') //creates a variable that stores all spans with a parent containing the class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //creates a variable that stores all classes named 'item' with children who contain spans with a class of "completed" 

Array.from(deleteBtn).forEach((element)=>{ //creates an array from our selection and starts a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click and then calls a function called deleteItem
}) // Close forEach Loop

Array.from(item).forEach((element)=>{ // creates an array from our selection and starts a loop
    element.addEventListener('click', markComplete) // add an event listener to the item variable that listens for a click to run a function called markComplete
}) // Close forEach Loop

Array.from(itemCompleted).forEach((element)=>{ //create an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // add an eventlistener to the itemCompleted variable that listens for a click to run a function called markUnComplete
}) // Close forEach Loop

async function deleteItem(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and obtains the inner text within the list span.
    try{ // beginning of a try block
        const response = await fetch('deleteItem', { // create a response variable that waits for a fetch to return data from the deleteIem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // identifies the type of content expexted to be returned, JSON.
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) // closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is display

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markComplete(){ //declare an ansynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ // starting a tray block to do something
        const response = await fetch('markComplete', { //create a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markUnComplete(){//make another async function this time called markComplete
    const itemText = this.parentNode.childNodes[1].innerText//selecting itemText from the span and getting the innerText from it
    try{//starting a try  block to do something
        const response = await fetch('markUnComplete', {//create a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify that content
                'itemFromJS': itemText//inside the body we declare theat 'itemFromJS': id the itemText, which is the inner text of our list item
            })//close the body object
          })//close the await fetch
        const data = await response.json()//awaiting on the JSON from the response to be converted
        console.log(data)//console.log the result of the data
        location.reload()//refresh the page to get the new info from the database, which would now contain a marked item which was the point of this function

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//console.log the error to the console
    }//close the catch block
}//end the function 