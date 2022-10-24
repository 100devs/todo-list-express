const deleteBtn = document.querySelectorAll('.fa-trash') //Creating a variable and assigning it to a all elements with a class of the trash can
const item = document.querySelectorAll('.item span') //Creating a variable and assigning it to a selection of span tags inside of a perant that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //Creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ //Creating an array from out selection and starting a loop 
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click, call a function called deleteItem
}) // close out loop

Array.from(item).forEach((element)=>{ // Creating an array from out selection and starting a loop 
    element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click, call a function called markComplete
}) // close out loop 

Array.from(itemCompleted).forEach((element)=>{ //Creating an array from out selection and starting a loop 
    element.addEventListener('click', markUnComplete)//add an event listener to only completed items 
}) //close loops

async function deleteItem(){ // Declare an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item  and grabs only the inner text within the list span
    try{ // Starting a try block to do something 
        const response = await fetch('deleteItem', { //Creates a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', //Setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected, which is JSON
            body: JSON.stringify({ //Declare the message content being passed, and stringify that content
              'itemFromJS': itemText // Setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //Closing the body
          }) // closing the object 
        const data = await response.json() //Waiting on the server to respond with some JSON
        console.log(data) //Log the data to the console
        location.reload()  //Page reload

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} //end the function 

async function markComplete(){ // Declare an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ //  Starting a try block to do something 
        const response = await fetch('markComplete', { //Creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', // Setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'},// Specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify the content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) // Closing the body
          })// Closing the object 
        const data = await response.json() //Waiting on the server to respond with some JSON
        console.log(data)//Log the data to the console
        location.reload()//Page reload

    }catch(err){// If an error occurs, pass the error into the catch block
        console.log(err)// log the error to the console
    }// close the catch block
}//end the function 

async function markUnComplete(){ // Declare an asynchronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ //  Starting a try block to do something
        const response = await fetch('markUnComplete', {//Creates a response variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put',// Setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'},// Specifying the type of content expected, which is JSON
            body: JSON.stringify({// Declare the message content being passed, and stringify the content
                'itemFromJS': itemText// setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            })// Closing the body
          })// Closing the object 
        const data = await response.json()//Waiting on the server to respond with some JSON
        console.log(data)//Log the data to the console
        location.reload()//Page reload

    }catch(err){// If an error occurs, pass the error into the catch block
        console.log(err)// log the error to the console
    }// close the catch block
}//end the function 