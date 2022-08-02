const deleteBtn = document.querySelectorAll('.fa-trash')//Creating a constant variable and assigning it to  all elements with a class of 'fa-trash'
const item = document.querySelectorAll('.item span')//creating a constant variable and assinging it to all elements with a span tag included in a class with the name 'item' '
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a constant variable and assigning it to spans with a class name 'completed' that is within a parent that has a class name of 'item'

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection ans starting a loop
    element.addEventListener('click', deleteItem)//add an event llistener to the current item that waits for a 'click', that calls a function called 'deleteItem'
})//closing the loop

Array.from(item).forEach((element)=>{//Creating an array and starting a loop
    element.addEventListener('click', markComplete)//Adding an event listner to the current item that waits for a 'click', and calls the function called 'markComplete'
})//closing the loop

Array.from(itemCompleted).forEach((element)=>{//Creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)//Adds an event listner to only completed items and callss the function called 'markUpComplete' on each one.
})//closing the loop

async function deleteItem(){//Declaring a asynchronous function(async function allows us to change the flow of the execution)
    const itemText = this.parentNode.childNodes[1].innerText //Checks inside of the list item and selects only the inner text within the list span and assigning it to a constant variable 'itemText'
       try{ //Starting a try block
        const response = await fetch('deleteItem', {  //Creating a constant response variable that waits on a fetch to get data from the deleteItem route
            method: 'delete', //Sets the CRUD method of the route
            headers: {'Content-Type': 'application/json'}, //Specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed , and stringnify that content
              'itemFromJS': itemText //setting the content of the body to the innerText of the list itme and naming it 'itemFromJS'
            })//Closing the body
          })//Closing the object
        const data = await response.json()//waiting on JSON from the response to be converted and assigned to the constant variable 'data'
        console.log(data)//log the result to the console.
        location.reload()//reloads the page to update what needs to be displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }//Close tht catch block
}//close the function

async function markComplete(){//declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText//Checks inside of the list item and selects only the inner text within the list span and assigning it to a constant variable 'innerText'
    try{//Starting a try block
        const response = await fetch('markComplete', {//creates a response variable that waits on a fetch to get daata from the result of the markComplete route
            method: 'put',  //setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},//Specifying the type of content expected , which is JSON
            body: JSON.stringify({ //Declare the message content being passed , and stringify that content
                'itemFromJS': itemText//Setting the content of the body to the inner text of the listn item and naming it 'itemFromJS'
            })//Closing the body
                  })//Closing the object
        const data = await response.json()//Waiting on JSON from the response to be converted
        console.log(data)//Logging the result to the console
        location.reload()//Reloads the page to update what should be displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }//closing the catch block
}//Closing the function

async function markUnComplete(){//declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText//Checks inside of the list item and selects only the innerText within the list span and assigning it to the constant variable 'itemText'
    try{//stating a try block 
        const response = await fetch('markUnComplete', {//makes a response constant variable that awaits on the fetch to get data from the result of the markUncomplete route.
            method: 'put',//setting the CRUD method to 'update' for the route 
            headers: {'Content-Type': 'application/json'},//Specifying the type of content expected , which is JSON
            body: JSON.stringify({//Declare the message content being passed , and stringify that content
                'itemFromJS': itemText//Setting the content of the body to the inner text of the listn item and naming it 'itemFromJS'
            })//Closing the body
          })//Closing the object
        const data = await response.json()//Waiting on JSON from the response to be converted
        console.log(data)//Logging the result to the console
        location.reload()//Reloads the page to update what should be displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }//closing the catch block
}//Closing the function