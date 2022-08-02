const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with a class of the trash can.
const item = document.querySelectorAll('.item span')  //creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item".
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with the class of "item".

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a 'click', and then calls a function caled deleteItem.
})//closes our loop


Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete)// adds an event listener to the current item that waits for a click and then calls a function called markComplete
}) //closes our loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to ONLY completed items
})// closes our loop

async function deleteItem(){//declares an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs ONLY the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creating a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifiying the type of content expected, which is JSON 
            body: JSON.stringify({ //declare the message content being passed, and stringify that content 
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          })//closing the object
        const data = await response.json() //waiting JSON from the response to be converted
        console.log(data) // logs the data from the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } //close the catch block
} //end the function


async function markComplete(){ //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs ONLY the inner text within the list span.
    try{ //starts a try block to do something
        const response = await fetch('markComplete', { //creating a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifiying the type of content expected, which is JSON 
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting JSON from the response to be converted
        console.log(data) //logs the data from the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function


/*
* Name: markComplete
* Description: fires when an item from our todo is clicked and will make a PUT request in our server.
*/
async function markUnComplete(){ //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs ONLY the inner text within the list span.
    try{ //starts a try block to do something
        const response = await fetch('markUnComplete', { //creating a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifiying the type of content expected, which is JSON 
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText  //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting JSON from the response to be converted
        console.log(data) //logs the data from the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function