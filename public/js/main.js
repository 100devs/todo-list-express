const deleteBtn = document.querySelectorAll('.fa-trash') // grabs all the fa-trash classes and adds them in a deleteBtn variable array
const item = document.querySelectorAll('.item span') // grabs all spans in the item class parent and adds them in an item variable array
const itemCompleted = document.querySelectorAll('.item span.completed') // grabs all the span.completedvin the item classes parent and adds them in an itemCompleted variable array

Array.from(deleteBtn).forEach((element)=>{ // goes through all items in the deleteBtn array 
    element.addEventListener('click', deleteItem) // if the item in the array was clicked it runs the deleteItem function on it
})

Array.from(item).forEach((element)=>{ // goes through all items in the item array 
    element.addEventListener('click', markComplete) // if the item in array was clicked run the markComplete function on it
})

Array.from(itemCompleted).forEach((element)=>{ // goes through all items in the itemCompleted array 
    element.addEventListener('click', markUnComplete) // if the item in the array was clicked run the markUnComplete function on it
})

async function deleteItem(){ // run the funtion as an async function
    const itemText = this.parentNode.childNodes[1].innerText // grabs the innertext in childNode in index 1 of the parent node and sets it to the itemText variable
    try{ // creates a start block to tell the app what to run in the function
        const response = await fetch('deleteItem', { // HTTP requests the deleteItem from the API and awaits a response 
            method: 'delete', // specifys the HTTP request as a delete which tells the server to delete something
            headers: {'Content-Type': 'application/json'}, // tells the server it's sending json data in the body
            body: JSON.stringify({ // the body is what you're sending to the server. converts js object to json string
              'itemFromJS': itemText // the variable from your code you want to delete
            })
          })
        const data = await response.json() // creates a data variable with the response from the server and converts it to a js object from json
        console.log(data) // logs the data in the console
        location.reload() // reloads the page

    }catch(err){ // runs this if there's an error during the try block
        console.log(err) // logs an error to show that somethiing went wrong during the deleting process
    }
}

async function markComplete(){ // run the function as an async function
    const itemText = this.parentNode.childNodes[1].innerText // grabs the innertext in childNode in index 1 of the parent node and sets it to the itemText variable
    try{ // creates a start block to tell the app what to run in the function
        const response = await fetch('markComplete', { // HTTP requests the markComplete from the API and awaits a response 
            method: 'put', // specifys the HTTP request as a put which tells the server to update something
            headers: {'Content-Type': 'application/json'}, // tells the server it's sending json data in the body
            body: JSON.stringify({ // the body is what you're sending to the server. converts js object to json string
                'itemFromJS': itemText // the variable from your code you want to mark as complete
            })
          })
        const data = await response.json() // creates a data variable with the response from the server and converts it to a js object from json
        console.log(data) // logs the data in the console
        location.reload() // reloads the page

    }catch(err){ // runs this if there's an error during the try block
        console.log(err) // logs an error to show that somethiing went wrong during the deleting process
    }
}

async function markUnComplete(){ // run the function as an async function
    const itemText = this.parentNode.childNodes[1].innerText // grabs the innertext in childNode in index 1 of the parent node and sets it to the itemText variable
    try{ // creates a start block to tell the app what to run in the function
        const response = await fetch('markUnComplete', { // HTTP requests the markUnComplete from the API and awaits a response 
            method: 'put', // specifys the HTTP request as a put which tells the server to update something
            headers: {'Content-Type': 'application/json'}, // tells the server it's sending json data in the body
            body: JSON.stringify({ // the body is what you're sending to the server. converts js object to json string
                'itemFromJS': itemText // the variable from your code you want to mark as complete
            })
          })
        const data = await response.json() // creates a data variable with the response from the server and converts it to a js object from json
        console.log(data) // logs the data in the console
        location.reload() // reloads the page

    }catch(err){ // runs this if there's an error during the try block
        console.log(err) // logs an error to show that somethiing went wrong during the deleting process
    }
}
