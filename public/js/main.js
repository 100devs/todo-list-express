const deleteBtn = document.querySelectorAll('.fa-trash') /* stores all the delete icon elements from the dom into a variable */ 
const item = document.querySelectorAll('.item span') /* stores todo list items from the DOM into a variable */ 
const itemCompleted = document.querySelectorAll('.item span.completed') /* collects all the completed items from the DOM */ 

Array.from(deleteBtn).forEach((element)=>{ /* creates an array from deleteBtn and loops through each element */ 
    element.addEventListener('click', deleteItem) /* adds a click event listener and calls the deleteItem function */ 
}) /* closes for loop */ 

Array.from(item).forEach((element)=>{ /* turns item into an array and loops through each element */ 
    element.addEventListener('click', markComplete) /* adds an event listener for clicks and calls the markComplete function */ 
}) /* closes loop */ 

Array.from(itemCompleted).forEach((element)=>{ /* turns itemCompleted into an array and loops through each element */ 
    element.addEventListener('click', markUnComplete) /* adds an event listener to each completed element and calls markUnComplete function */ 
}) /* closes loop */ 

async function deleteItem(){ /* declares an async function */ 
    const itemText = this.parentNode.childNodes[1].innerText /* looks in the list item and saves the todo item text in a variable */ 
    try{ /* once a response is received run the try block */ 
        const response = await fetch('deleteItem', { /* stores response for the deleteItem route in a variable */ 
            method: 'delete', /* the CRUD operation used */ 
            headers: {'Content-Type': 'application/json'}, /* specifies the content will be JSON format */ 
            body: JSON.stringify({ /* convert the data into a string */ 
              'itemFromJS': itemText /* storing the inner text of the todo item with a key of itemFromJS */ 
            }) /* closing the body block */ 
          }) /* closing the response object */ 
        const data = await response.json() /* saving the server response as JSON */ 
        console.log(data) /* print the promise to the console */ 
        location.reload() /* refresh the page with the data received */ 

    }catch(err){ /* retain any errors that occur into the catch block */ 
        console.log(err) /* print those errors to the console */ 
    } /* close error catch block */ 
} /* close async function block */ 

async function markComplete(){ /* declares an async function */ 
    const itemText = this.parentNode.childNodes[1].innerText /* looks into the list item and saves the text in a variable */ 
    try{ /* starting a try block */ 
        const response = await fetch('markComplete', { /* stores fetch response for the markComplete route in a variable */ 
            method: 'put', /* setting the CRUD method used */ 
            headers: {'Content-Type': 'application/json'}, /* indicates the data format used (JSON) */ 
            body: JSON.stringify({ /* turn the response into a string and storing it under a key of body */ 
                'itemFromJS': itemText /* storing the actual text in a key that can be called */ 
            }) /* closing the body object block */ 
          }) /* closing the fetch response block */ 
        const data = await response.json() /* saving the JSON confirmation of the update that we are waiting for */ 
        console.log(data) /* printing the updated response to the console */ 
        location.reload() /* refreshing the page with the updated response */ 
    }catch(err){ /* save any errors and use in this catch block */ 
        console.log(err) /* print errors to the console */ 
    } /* close the catch block */ 
} /* close the async function block */ 

async function markUnComplete(){ /* declaring an async function */ 
    const itemText = this.parentNode.childNodes[1].innerText /* looks into the list item span and saves the text in a variable */ 
    try{ /* starting a try block */ 
        const response = await fetch('markUnComplete', { /* saving the fetch response to the markUnComplete route as a variable */ 
            method: 'put', /* sets the CRUD method to update */ 
            headers: {'Content-Type': 'application/json'}, /* sets the content type as JSON */ 
            body: JSON.stringify({ /* turn the JSON response into a string */ 
                'itemFromJS': itemText /* save the string text in a key of itemFromJS */ 
            }) /* close the body block */ 
          }) /* close the object */ 
        const data = await response.json() /* store the JSON message confirming the update in a variable */ 
        console.log(data) /* print the result to the console */ 
        location.reload() /* refresh the page with updated data displayed */ 

    }catch(err){ /* save any errors that occur */ 
        console.log(err) /* print those errors to the console */ 
    } /* close catch block */ 
} /* close async function block */ 