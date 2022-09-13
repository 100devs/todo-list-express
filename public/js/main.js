const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to all elements with a class of the trash can
const item = document.querySelectorAll('.item span') // creates a variable and assigns it to the span tags inside of element with class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // creates a variable and assigns it to the completed span elements (the ones with class "completed") inside of parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ // takes all the delete buttons and creates an array, then starts a loop
    element.addEventListener('click', deleteItem) // add an event listener to each item (delete button) and calls the deleteItem function when the user clicks the button 
}) // closes the loop

Array.from(item).forEach((element)=>{ // creates an array from all variables "item" (span inside of class "item") and starts a loop
    element.addEventListener('click', markComplete) // adds an event listener to each element in the array to call the "markComplete" function when the user clicks
}) // closes the loop

Array.from(itemCompleted).forEach((element)=>{   //creates an array from all variables "itemCompleted" and starts a loop
    element.addEventListener('click', markUnComplete) //add an event listener that will call the "markUnComplete" function when the user clicks
}) // closes the loop

async function deleteItem(){ //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ // starts try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declares the message content being passed, and turn that content into a string
              'itemFromJS': itemText // sets the content of the body to the inner text of the list item, and naming it 'itemFromJS' 
            }) // closes the body
          }) // closes the object
        const data = await response.json() // waits on JSON from the response to be converted 
        console.log(data) // logs result to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // error handling. if an error occurs, pass the error into the catch 
        console.log(err) // logs the error to the console
    } // closes catch block
} // closes deleteItem function

async function markComplete(){ // declares  asynchronous function markComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ // starts try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', // sets the CRUD method for the route as "update"
            headers: {'Content-Type': 'application/json'}, //specifies the type of content expected, which is JSON
            body: JSON.stringify({  // declares the message content being passed, and turn that content into a string
                'itemFromJS': itemText // sets the content of the body to the inner text of the list item, and names it 'itemFromJS' 
            }) // closes the body
          }) // closes the object
        const data = await response.json() // waits on JSON from the response to be converted
        console.log(data)  // logs result to the console
        location.reload() // reloads the page to update what is displayed
 
    }catch(err){ // error handling. if an error occurs, passes the error into the catch 
        console.log(err) // logs the error to the console
    } // closes catch block
} // closes markComplete function

async function markUnComplete(){ // declares  asynchronous function markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ // starts try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', // sets the CRUD method for the route as "update"
            headers: {'Content-Type': 'application/json'}, //specifies the type of content expected, which is JSON
            body: JSON.stringify({ // declares the message content being passed, and turn that content into a string
                'itemFromJS': itemText // sets the content of the body to the inner text of the list item, and names it 'itemFromJS' 
            }) // closes the body
          }) // closes the object
        const data = await response.json() // waits on JSON from the response to be converted
        console.log(data) // logs result to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // error handling. if an error occurs, passes the error into the catch
        console.log(err) // logs the error to the console
    } // closes catch block
} // closes markUnComplete function