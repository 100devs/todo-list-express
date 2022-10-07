const deleteBtn = document.querySelectorAll('.fa-trash') // create a variable and assigning it to a selection of all elements with a class of fa-trash
const item = document.querySelectorAll('.item span') // create a variable and assign it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // create a variable and assign it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // add an event listener to the current item that waits for a click and then calls a function called deleteItem
}) // close the loop

Array.from(item).forEach((element)=>{ // create an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click and then calls a function called markComplete
}) // close the loop

Array.from(itemCompleted).forEach((element)=>{ // create an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // add an event listener to only completed items
}) // close the loop

async function deleteItem(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { //create a response variable that waits on a fetch request to get data from the result of the deleteItem route
            method: 'delete', //sets a CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //set the content of the body to the inner text of the list item, and name it 'itemFromJS'
            })//close the body
          })//close the object
        const data = await response.json() //wait on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() // reloads the page t pdate what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }// close the catch block
} //end the function

async function markComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markComplete', { //create a response variable that waits on a fetch request to get data from the result of the markComplete route
            method: 'put', //sets a CRUD method to "Update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is JSON
            body: JSON.stringify({ //delcare the message content being passed, and stringify the content
                'itemFromJS': itemText //setting the conent of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //closing the body
          }) //close the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markUnComplete(){ //delcare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { //create a response variable that waits on a fetch request to get data from the result of the markUnComplete route
            method: 'put', //set the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText // //setting the conent of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //close the body
          }) //close the object
        const data = await response.json() //wait on JSON from the response to be converted
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function