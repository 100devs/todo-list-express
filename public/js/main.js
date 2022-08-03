
const deleteBtn = document.querySelectorAll('.fa-trash') // Store all elements in the DOM with class '.fa-trash' to a variable

const item = document.querySelectorAll('.item span') // Store all span elements inside of a parent that has an '.item' class to a variable

const itemCompleted = document.querySelectorAll('.item span.completed') // store all span elements inside the '.item' class that also have a 'completed class inside a variable

Array.from(deleteBtn).forEach((element)=>{ // Create an array from the selection 'deleteBtn'and start a loop 
    element.addEventListener('click', deleteItem)// Assign each with an event listener that calls the  function 'deleteItem'
}) // close the loop


Array.from(item).forEach((element)=>{// Create an array from selection 'item' and starting a loop, 
    element.addEventListener('click', markComplete) //Assign each an event listener that calls the function 'markComplete'
}) // close loop


Array.from(itemCompleted).forEach((element)=>{// Create an array from the selection 'itemCompleted' and start a loop
    element.addEventListener('click', markUnComplete)// assign an event listener to ONLY completed items and calls the function 'markUnComplete'
}) //close the loop

// Declare async function to delete the todo item associated with the delete icon we clicked
async function deleteItem(){
   
    const itemText = this.parentNode.children[1].innerText // get the text value of the list item and save it in a var 'itemText'
    try{ // start a try block
        
        const response = await fetch('deleteItem', { // Create a response var that waits on a fetch to get data from the result of the 'deleteItem' route
            method: 'delete', //declare a CRUD method of delete
            headers: {'Content-Type': 'application/json'}, // Specify the type of content expected, which is JSON
            body: JSON.stringify({ // Declare and stringify the message content being passed
              'itemFromJS': itemText // name the the content of the body 'itemFromJS' and set it to the inner text of the list item
            }) //close the body
          }) // close the object
        // wait for a response from the server
        const data = await response.json() //wait on JSON from the response to be converted
        console.log(data) // display server response 
        location.reload() // reload the page to update what is displayed

    }catch(err){ // pass errors into catch block
        console.log(err) // log error to the console
    } // close catch block
} // end the function


async function markComplete(){//Declare async function to mark a todo item as complete
    
    const itemText = this.parentNode.children[1].innerText //Get the text of the todo item and store it in itemText
   
    try{ // start a try block
        const response = await fetch('markComplete', { //create a response var that waits on a fetch to get data from the result of the 'markComplete' route
            method: 'put', //set the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, // specify the type of content expected, which is JSON
            
            body: JSON.stringify({ // declare and stringify the content being passed 
                'itemFromJS': itemText// Define the key 'itemFromJS' as the text from the todo item
            }) // close the body
          }) // close the object
        const data = await response.json() // wait on JSON from the response to be converted
        console.log(data) // display the server's response in the console
        location.reload() // reload the page to update what is displayed

    }catch(err){ // pass any errors into the catch block
        console.log(err) // display the error in the console
    } // close the catch block
} // end function


async function markUnComplete(){// Declare async function to mark a complete todo list
 
    const itemText = this.parentNode.children[1].innerText // Get the text of the todo item
    try{ // start a try block
        const response = await fetch('markUnComplete', { // create a response var that waits on a fetch ot get data from the result of the ' markUnComplete' route
            method: 'put',// set CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, // specify the type of content expected, which is JSON
            body: JSON.stringify({// declare and stringify the content being passed
                'itemFromJS': itemText // Define the key 'itemFromJS' as the text from the todo item
            }) // close the body
          }) // close the object
        const data = await response.json() // wait on JSON  the response to be converted
        console.log(data) // Display server response
        location.reload() // reload the page to update what is displayed

    }catch(err){ // pass any errors into the catch block
        console.log(err) // display the error in the console
    } //close the catch block
} //end function