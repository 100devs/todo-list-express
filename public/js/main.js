const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to selecton of the elements with a class of fa-trash
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to selecton of the elements with a class of item that are spans
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to selecton of the elements with a class of items that are spans with a class of completed

Array.from(deleteBtn).forEach((element)=>{ //creates an array from our selections and begins looping through each item
    element.addEventListener('click', deleteItem) //adding an event listener to each trashcan that waits for a click and then runs the function deleteItem on click
}) // close the loop

Array.from(item).forEach((element)=>{  //creates an array from our selections and begins looping through each item
    element.addEventListener('click', markComplete) //adding an event listener to each item that waits for a click and then runs the function markComplete on click
}) // close the loop

Array.from(itemCompleted).forEach((element)=>{ //creates an array from our selections and begins looping through each item
    element.addEventListener('click', markUnComplete)//adding an event listener to each item that waits for a click and then runs the function markUnComplete on click
}) //closes the loop

async function deleteItem(){ //declaring an asynchoronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item to get the text value only of the specified list span
    try{ // starting a try block
        const response = await fetch('deleteItem', { //creating a variable that waits on a fetch to get the data from the result of the deleteItem route
            method: 'delete', //starting an object and giving it the method of delete
            headers: {'Content-Type': 'application/json'}, // specififing the type of content expected
            body: JSON.stringify({ //turns the content being passed into a string
              'itemFromJS': itemText //setting the content of the body as the innertext and giving it a name of itemFrom JS
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on the server to respond with json that is converted
        console.log(data) // logging the data to the console
        location.reload() // reloads the page to update the changes

    }catch(err){ //if there is an error, pass it in the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //ends the function

async function markComplete(){ //declares an asyncronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item to get the text value only of the specified list span
    try{ //starting a try block
        const response = await fetch('markComplete', { //declaring a variable that awaits a fetch to get the data from the function markComplete
            method: 'put', //setting the crud method to update for the route
            headers: {'Content-Type': 'application/json'},// specififing the type of content expected
            body: JSON.stringify({ //turns the content being passed into a string
                'itemFromJS': itemText //setting the content of the body as the innertext and giving it a name of itemFrom JS
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on the server to respond with json that has been converted
        console.log(data) // logging the data to the console
        location.reload() // reloads the page to update the changes

    }catch(err){ //if there is an error, pass it in the catch block
        console.log(err) //log the error to the console
    } //closes the catch block
} //closes the function

async function markUnComplete(){ //declares an asyncronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item to get the text value only of the specified list span
    try{ //starting a try block
        const response = await fetch('markUnComplete', { //declaring a variable that awaits a fetch to get the data from the function markUnComplete
            method: 'put', //setting the crud method to update for the route
            headers: {'Content-Type': 'application/json'},// specififing the type of content expected
            body: JSON.stringify({ //turns the content being passed into a string
                'itemFromJS': itemText //setting the content of the body as the innertext and giving it a name of itemFrom JS
            }) //closes the body
          }) //closing the object
        const data = await response.json() //waiting on the server to respond with json that has been converted
        console.log(data) // logging the data to the console
        location.reload() // reloads the page to update the changes

    }catch(err){ //if there is an error, pass it in the catch block
        console.log(err) //log the error to the console
    } //closes the catch block
} //closes the function