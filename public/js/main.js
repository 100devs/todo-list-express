const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable that grabs all the elements that have a class of fa-trash on them 
const item = document.querySelectorAll('.item span') // creating a variable that grabs all the elements that have a parent class of item with spans inside it/
console.log(item)
const itemCompleted = document.querySelectorAll('.item span.completed') // creats a variable that grabs all the elements with a parent class of item which are inside a span that has a class of completed 
console.log(itemCompleted)

Array.from(deleteBtn).forEach((element)=>{ // creating an array of all the deleteBtns, iterating through them/
    element.addEventListener('click', deleteItem) // adding an event listerner to each element in the array listening out for a click and then calls a deleteItem function //
}) // closing the forEach

Array.from(item).forEach((element)=>{ // creating an array of all the items and iterating through each item
    element.addEventListener('click', markComplete) // adding an event listener on each item that is listening out for a click which triggers the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and iterating through each item
    element.addEventListener('click', markUnComplete) // putting an event listener on ONLY completed items
}) // closing the loop

async function deleteItem(){ // declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[5].innerText //  looks inside of the list item and grabs ONLY the inner text within 
    
    
    try{ //declaring a try block, it allows us to run something
        const response = await fetch('deleteItem', { // creating a variable that awaits on a fetch to get data from the result of the deleteItem route
            method: 'delete', // we're declaring an object and setting the CRUD method we're using for the route
            headers: {'Content-Type': 'application/json'}, // specifiying the type of content expected, which is JSON
            body: JSON.stringify({ // body is the message we're getting from the request object, turning it into a string
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() //we're waiting on the response from the server to be converted from JSON to a JavaScript object. 
        console.log(data) // log the data to the console    
        location.reload() // refresh the page automatically so it makes a GET request and shows the page with the item deleted

    }catch(err){ // if an error is thrown, pass the error in the catch block
        console.log(err) // log the error to the console
    } // closing the catch block 
} // end the function

async function markComplete(){ // declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[5].innerText //looks inside of the list item and grabs ONLY the innerText within the list span
    try{ // starting a try block to do something
        const response = await fetch('markComplete', { // declaring a response that waits on a fetch to get data from the result of the markComplete route
            method: 'put', // setting the CRUD method to update 
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } //close the catch block
} //end the function

async function markUnComplete(){ // declaring an asynchronous function  
    const itemText = this.parentNode.childNodes[5].innerText //looks inside of the list item and grabs ONLY the innerText within the list span
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { // declaring a response that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', // setting the CRUD method to update 
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } //close the catch block
} //end the function