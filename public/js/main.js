const deleteBtn = document.querySelectorAll('.fa-trash') /* creates a const variable and assigning it to a selection of all the elements that have a .fa-trash class within the DOM */ 
const item = document.querySelectorAll('.item span') /* creates a const variable and assigning it to a selection of all the span elements that have a .item class within the DOM */ 
const itemCompleted = document.querySelectorAll('.item span.completed') /* creates a const variable and assigning it to a selection of all the span that has .completed class that is located within a parent .item class element within the DOM */ 

Array.from(deleteBtn).forEach((element)=>{ /* create an array from the selection of .fa-trash elements and then within the Array you have a forEach loop/method */ 
    element.addEventListener('click', deleteItem)  /* for each element, there is a EvenListener that is added - the eventlistener is triggered with a click and then triggers deleteItem function */ 
}) /* no parentheses in deleteItem b/c it would be executing immediately and returns the result of that function. you don't want to call it right now */ 

Array.from(item).forEach((element)=>{ /* create an array from the selection of .item span elements and then within the Array you have a forEach loop/method */ 
    element.addEventListener('click', markComplete) /* for each element, there is a EvenListener that is added - the eventlistener is triggered with a click and then triggers markComplete function */ 
})

Array.from(itemCompleted).forEach((element)=>{ /* create an array from the selection of itemCompleted elements and then within the Array you have a forEach loop/method */ 
    element.addEventListener('click', markUnComplete) /* for each element, there is a EvenListener that is added - the eventlistener is triggered with a click and then triggers markUnComplete function */ 
})

async function deleteItem(){        /* declares an async function called deleteItem : it is async b/c we can allow the function to wait while other code is running */ 
    const itemText = this.parentNode.childNodes[1].innerText  /* you are creating a const itemText variable that stores the innerText of the second child node that is within the parentNode of the clicked trash can icon. the childNode[0] is the bullet ...? */
    try{ /* starting a try block. try attempts to execute a code */ 
        const response = await fetch('deleteItem', { /* we create a const variable called response that is awaiting for a fetch response. fetch tries to request data from the result of deleteItem route. */
            method: 'delete', /* we create an object and we are telling us that this is a delete HTTP method - set CRUD method for the route */ 
            headers: {'Content-Type': 'application/json'}, // we are specifying that the data we are expecting is JSON - type of content expected. 
            body: JSON.stringify({  // declare the message content being passed to the request; and stringify that content 
              'itemFromJS': itemText // we are setting content of the body; we are sending a key-value pair of 'itemFromJS' later it will be referred to as body.itemFromJS. 
            }) // closing the stringify method 
          }) // closing tag for fetch request 
        const data = await response.json() // create a const variable that stores the response that we are getting back from the server (that we expect to respond with JSON)
        console.log(data) // we console log the result 
        location.reload() // we are telling the client-side to reload/refresh 

    }catch(err){ /* if there is an error on the try block we have a catch block that handles the error & responds to it */ 
        console.log(err) // we are telling it to log the error on console 
    }
}

async function markComplete(){ /* declares an async function called markComplete */ 
    const itemText = this.parentNode.childNodes[1].innerText /* looks inside of the list item and extract only the inner text within the list span. this refers to the container of the list item */
    try{ /* starting a try block. try attempts to execute a code */ 
        const response = await fetch('markComplete', { // create const variable called response that is awaiting for result of fetch request to get data from result of 'markComplete' route 
            method: 'put', // set CRUD method for the route as PUT (update)
            headers: {'Content-Type': 'application/json'}, // we are specifying that the data we are expecting is JSON - type of content expected. 
            body: JSON.stringify({ // declare the message content being passed & stringify the content 
                'itemFromJS': itemText // we are setting content of the body; we are sending a key-value pair of 'itemFromJS' later it will be referred to as body.itemFromJS. 
            }) // close the stringify method 
          }) // closes the fetch request 
        const data = await response.json() // create  const variable that stores the response from the server that is converted to JSON (we are WAITING for the response)
        console.log(data) // log the result to the console. 
        location.reload() // reloads the page to update what is displayed 

    }catch(err){ // if error occurs, pass error into catch block 
        console.log(err) // log the rror to the console 
    } // close the catch block 
} // end the function 

async function markUnComplete(){ /* declares an async function called markUnComplete */ 
    const itemText = this.parentNode.childNodes[1].innerText /* looks inside of the list item and extract only the inner text within the list span. this refers to the container of the list item */
    try{ /* starting a try block. try attempts to execute a code */ 
        const response = await fetch('markUnComplete', { // create const variable called response that is awaiting for result of fetch request to get data from result of 'markUnComplete' route 
            method: 'put', // set CRUD method for the route as PUT (update)
            headers: {'Content-Type': 'application/json'}, // we are specifying that the data we are expecting is JSON - type of content expected. 
            body: JSON.stringify({ // declare the message content being passed & stringify the content 
                'itemFromJS': itemText // we are setting content of the body; we are sending a key-value pair of 'itemFromJS' later it will be referred to as body.itemFromJS. 
            })// close the stringify method 
          }) // closes the fetch request 
        const data = await response.json() // create  const variable that stores the response from the server that is converted to JSON (we are WAITING for the response)
        console.log(data) // log the result to the console. 
        location.reload()  // reloads the page to update what is displayed 

    }catch(err){ // if error occurs, pass error into catch block 
        console.log(err) // log the rror to the console 
    } // close the catch block 
} // end the function 