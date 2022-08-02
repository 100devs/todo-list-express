const deleteBtn = document.querySelectorAll('.fa-trash') /* selects the trash icon areas */
const item = document.querySelectorAll('.item span') /* selects the span text areas in the item class that DO NOT have the completed class attached */
const itemCompleted = document.querySelectorAll('.item span.completed') /* selects the span text areas in the item class that DO have the completed class attached */

Array.from(deleteBtn).forEach((element)=>{ /* gets an array from the areas gathered from the deleteBtn variable, and tells them to do something for each one */
    element.addEventListener('click', deleteItem) /* adds a click event listener on each item gathered, and tells it to run the deleteItem function */
}) /* closes the array gathering and event listener adding */

Array.from(item).forEach((element)=>{ /* gets an array from the areas gathered from the item variable, and tells them to do something for each one */
    element.addEventListener('click', markComplete) /* adds a click event listener on each item gathered, and tells it to run the markComplete function */
}) /* closes the array gathering and event listener adding */

Array.from(itemCompleted).forEach((element)=>{ /* gets an array from the areas gathered from the itemCompleted variable, and tells them to do something for each one */
    element.addEventListener('click', markUnComplete) /* adds a click event listeners on each item gathered, and tells it to run the markUnComplete function */
}) /* closes the array gathering and event listener adding */

async function deleteItem(){ /* starts an async function to delete items */
    const itemText = this.parentNode.childNodes[1].innerText /* creates a variable with the text to be deleted */
    try{ /* starts a try catch where the code tries to do the first things and if it can't, it throws an error */
        const response = await fetch('deleteItem', { /* variable assigned to await response of the fetch for the deleteItem */
            method: 'delete', /* sets the CRUD method to be used, in this case deleting the item. */
            headers: {'Content-Type': 'application/json'}, /* says the type of content will be JSON */
            body: JSON.stringify({ /* declare content and stringify it */
              'itemFromJS': itemText /* uses the variable containing the text to be deleted and assigns it to another variable to be used outside of this code block */
            }) /* closes the body */
          }) /* closes the response */
        const data = await response.json() /* variable waiting for response and making it JSON */
        console.log(data) /* writes the contents of the data variable to the console */
        location.reload() /* reloads the current location */

    }catch(err){ /* says what is to be done in case of error */
        console.log(err) /* writes the error to the console */
    } /* closes the catch */
} /* closes the async function */

async function markComplete(){ /* starts an async function to mark items completed */
    const itemText = this.parentNode.childNodes[1].innerText /* creates a variable with the text to be marked complete */
    try{ /* starts a try catch where the code tries to do the first things and if it can't, it throws an error */
        const response = await fetch('markComplete', { /* variable assigned to await response of the fetch for the markComplete */
            method: 'put', /* sets the CRUD method to be used, in this case updating the item. */
            headers: {'Content-Type': 'application/json'}, /* says the type of content will be JSON */
            body: JSON.stringify({ /* declare content and stringify it */
                'itemFromJS': itemText /* uses the variable containing the text to be updated and assigns it to another variable to be used outside of this code block */
            }) /* closes the body */
          }) /* closes the response */
        const data = await response.json() /* variable waiting for response and making it JSON */
        console.log(data) /* writes the contents of the data variable to the console */
        location.reload() /* reloads the current location */

    }catch(err){ /* says what is to be done in case of error */
        console.log(err) /* writes the error to the console */
    } /* closes the catch */
} /* closes the async function */

async function markUnComplete(){ /* starts an async function to mark items incomplete */
    const itemText = this.parentNode.childNodes[1].innerText /* creates a variable with the text to be marked incomplete */
    try{ /* starts a try catch where the code tries to do the first things and if it can't, it throws an error */
        const response = await fetch('markUnComplete', { /* variable assigned to await response of the fetch for the markUnComplete */
            method: 'put', /* sets the CRUD method to be used, in this case updating the item. */
            headers: {'Content-Type': 'application/json'}, /* says the type of content will be JSON */
            body: JSON.stringify({ /* declare content and stringify it */
                'itemFromJS': itemText /* uses the variable containing the text to be updated and assigns it to another variable to be used outside of this code block */
            }) /* closes the body */
          }) /* closes the response */
        const data = await response.json() /* variable waiting for response and making it JSON */
        console.log(data) /* writes the contents of the data variable to the console */
        location.reload() /* reloads the current location */

    }catch(err){ /* says what is to be done in case of error */
        console.log(err) /* writes the error to the console */
    } /* closes the catch */
} /* closes the async function */