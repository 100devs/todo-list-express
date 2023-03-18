const deleteBtn = document.querySelectorAll('.fa-trash') //Creating a variable and
//assigning it to a selection of all elements with a class of .fa-trash(trashcan icon)//
const item = document.querySelectorAll('.item span') //creating a variable and assigning
//it to a selection of span tags inside of a parent that has a class of "item".
const itemCompleted = document.querySelectorAll('.item span.completed')//Creating a variable
//assigning it to a selection of spans with a class of "completed" inside of a parent witha  class of "item".
Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop.
    element.addEventListener('click', deleteItem)//add an event listener to the current item that waits for a click 
    //and then calls a function called deleteItem.
})//close our loop

Array.from(item).forEach((element)=>{//creating an array and starting a loop, selecting 
    //a span that has a class of "item"
    element.addEventListener('click', markComplete)//add event listener to the current
    //that waits for a click and then calls a function called markComplete.
})//close our loop

Array.from(itemCompleted).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)//adds an event listener to only completed items.
})//close our loop

async function deleteItem(){//declare an asynchronous function, 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs
     //only the inner text within the list span....this refers to the container which the item is in
    try{// starting a try block to do something, pairs with catch block to catch any errors
        const response = await fetch('deleteItem', {//creates a response variable that waits on a fetch
            // to get or grab data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify that content 
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item
              //and naming it 'itemFromJS'
            })//closing the body
          })//closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data)//log data to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//close the catch block
}//end the function

async function markComplete(){ //declare an asynchrounous funciton called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs
     //only the inner text within the list span....this refers to the container which the item is in
    try{ // starting a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch
            // to get or grab data from the result of the deleteItem route
            method: 'put', //ssetting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content 
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item
              //and naming it 'itemFromJS'
            })//closing the body
          })//closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data)//log data to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//close the catch block
}//end the function

async function markUnComplete(){ //declare an asynchrounous funciton called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs
     //only the inner text within the list span....this refers to the container which the item is in
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch
            // to get or grab data from the result of the markUnComplete route
            method: 'put', //ssetting the CRUD method to 'put' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({  //declare the message content being passed, and stringify that content 
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item
              //and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log data to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
}