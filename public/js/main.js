const deleteBtn = document.querySelectorAll('.fa-trash') //Creating a variable and assigning it to a selection all elements with a CLASS of the trashcan
const item = document.querySelectorAll('.item span') //Creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //Creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item" 

Array.from(deleteBtn).forEach((element)=>{ //Creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //Add an event listener to the current item that waits for a click and then calls a function called delteItem
}) //Close our loop

Array.from(item).forEach((element)=>{ //Creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //Add an event listenter to the current item that waits for a click and then calls a funtion called markComplete 
}) //Close our loop

Array.from(itemCompleted).forEach((element)=>{ //Creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to ONLY completed items
}) //Close our loop

async function deleteItem(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //Starting a try blo to do something
        const response = await fetch('deleteItem', { //Creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //Declare the message content being passed, and stringify that content
              'itemFromJS': itemText //Setting the content of the body to the inner text of the list item, and naming it 'ItemfromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //Log the result to the console
        location.reload() //Reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch break
} //End the function

async function markComplete(){ //Declare an asynchonous function
    const itemText = this.parentNode.childNodes[1].innerText //Looks inside of the list itme and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //Creates a response variable that waits on a fetch to get the data from the result of the markComplete route
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type o content expected, which is JSON
            body: JSON.stringify({ //Declare the message conetent being passed, and stingify that content
                'itemFromJS': itemText //Detting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //Reloads the page to upade what is displayed

    }catch(err){ //in an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //Close the catch break
} //End the function

async function markUnComplete(){ //Declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks insidd of the list itme and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //Creates a response variable that waits on a fetch to get the data from the result of the markComplete route
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //Delcare the mssage content being passed, and stingify that content 
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming
            }) //closing the body
          }) //closing the object
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}