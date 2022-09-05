const deleteBtn = document.querySelectorAll('.fa-trash') //Creating a variable and assigning it to a selection of all elements with .fa-trash class.
const item = document.querySelectorAll('.item span') //Creating a variable and assigning it to a selection of span tags inside of a parent that has a class of item.
const itemCompleted = document.querySelectorAll('.item span.completed') //Creating a variabe ad assigning it to a selection of  spans with a class of "completed"
// inside of a parent with a class of item.

Array.from(deleteBtn).forEach((element)=>{ /*Creating an array from our selection and starting to loop*/
    element.addEventListener('click', deleteItem) /*Adding an event listener to the current item that waits for a click, then calls
    a function called deleteItem*/
}) /*Close our loop.*/

Array.from(item).forEach((element)=>{ /*Creating an array from our selection and starting a loop. */
    element.addEventListener('click', markComplete) /*Add event listener to the current item that waits for a click and then calls a function called markComplete.*/
})/*Close our loop*/

Array.from(itemCompleted).forEach((element)=>{ /*Creating an array from our selection and starting a loop.*/
    element.addEventListener('click', markUnComplete) /*Adds an event listener only to completed items.*/
}) //Close loop.

async function deleteItem(){ //Declare asynchronous function.
    const itemText = this.parentNode.childNodes[1].innerText /*Looks inside of the list item and only grabs the inner text within the list span.*/
    try{ // Starting a try block.
        const response = await fetch('deleteItem', {//Createes a response variable that waits on a fetch to get adata from the result of deleteItem route.
            method: 'delete', //Sets the CRUD method for the route.
            headers: {'Content-Type': 'application/json'}, //Specifying the type of content expected, which is JSON.
            body: JSON.stringify({// Declare the message content being passed, and stringify that content.
              'itemFromJS': itemText  //Setting the content of the body to the inner text of the list item, and naming it "itemFromJS".
            })//Closing the body
          })//Closing the object.
        const data = await response.json()//Waiting on Json from the response to be converted.
        console.log(data)//log the result to the console.
        location.reload()//reloads the page to update what is displayed.

    }catch(err){ //If an error occurs, pass the error into the catch.
        console.log(err) //log the error into the console.
    } //Close catch block
} //end function

async function markComplete(){// Declare asynchronous function.
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside of the list item and grabs only the inner text within the list span.
    try{ //Starting a try block.
        const response = await fetch('markComplete', { //Creates a response variable that waits on fetch to get data from the result of the markComplete route.
            method: 'put', //Setting up the CRUD method to "update" for the route.
            headers: {'Content-Type': 'application/json'}, //Specifying the type of content expected, which is JSON.
            body: JSON.stringify({ //Declare the message content being passed, and stringify that content.
                'itemFromJS': itemText //Setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'.
            }) //Closing the body
          }) //Closing the function.
        const data = await response.json() //Wait for JSON from the response to be converted.
        console.log(data) //Log the result to the console.
        location.reload() //Reloads the page to update what is displayed.

    }catch(err){//catch block
        console.log(err) //Log error.
    } //end function
}

async function markUnComplete(){// Declare asynchronous function.
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside of the list item and grabs only the inner text within the list span.
    try{//Starting a try block.
        const response = await fetch('markUnComplete', { //Creates a response variable that waits on fetch to get data from the result of the markUncomplete route.
            method: 'put', //Setting up the CRUD method to "update" for the route.
            headers: {'Content-Type': 'application/json'},//Specifying the type of content expected, which is JSON.
            body: JSON.stringify({//Declare the message content being passed, and stringify that content.
                'itemFromJS': itemText //Setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'.
            })//Close body
          }) //Close object.
        const data = await response.json()//Wait for JSON from the response to be converted.
        console.log(data)//Log the result to the console.
        location.reload()//Reloads the page to update what is displayed.

    }catch(err){//Catch block
        console.log(err)//Log error
    }
}