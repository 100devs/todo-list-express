const deleteBtn = document.querySelectorAll('.fa-trash') // Creates a variable for storing the selector action on the font awesome trash can icon to use later and save writing excess/repetitive code.
const item = document.querySelectorAll('.item span') // Creates a variable to reduce duplicate code for the item span class from the DOM
const itemCompleted = document.querySelectorAll('.item span.completed') // Creates a variable to reduce duplicate code for the item completed option

Array.from(deleteBtn).forEach((element)=>{ //Creates an array for each index in the delete button variable
    element.addEventListener('click', deleteItem) //Adds an event listener to each member of the deleteBtn array to run the function deleteItem when clicked
})

Array.from(item).forEach((element)=>{ //Creates an array for all item nodes to allow for adding event listeners later
    element.addEventListener('click', markComplete) //Adds event listeners to each item in the item array created above
})

Array.from(itemCompleted).forEach((element)=>{ //Creates an array for all nodes of item's completed
    element.addEventListener('click', markUnComplete) //For each item completed we are adding an event listener to run markUncompleted when clicked
})

async function deleteItem(){ // Initiates an asynchronous function called delete item
    const itemText = this.parentNode.childNodes[1].innerText //creates a constant variable called item text and pulls the inner text from the child of the parent node.
    try{ // error prevention, tries the below and catches errors when we instantiate catch
        const response = await fetch('deleteItem', { // stores the response from the delete item path on our server in a variable
            method: 'delete', //Method of our fetch is a delete
            headers: {'Content-Type': 'application/json'}, //Set's content type as JSON
            body: JSON.stringify({ // converts the body json into a string
              'itemFromJS': itemText //itemText defined as start of function
            })
          })
        const data = await response.json() //stores the response.json as a variable called data
        console.log(data) //logs the data for reference
        location.reload() // reloads the current pace in the dom

    }catch(err){ // catches the error
        console.log(err) // logs the error
    }
}

async function markComplete(){ //instantiates an asynchronous function called mark complete
    const itemText = this.parentNode.childNodes[1].innerText // creates a local constant function that takes in inner text from the child of the parent node.
    try{ // error try catch prevention
        const response = await fetch('markComplete', { // creates a local fetch for the mark complete from our server
            method: 'put', // this is a put request meaning we are adding data to the server or changing it
            headers: {'Content-Type': 'application/json'}, //Sets the content type as JSON
            body: JSON.stringify({ //converts the JSON type to a string
                'itemFromJS': itemText // itemText set as start of function from pulled data?
            })
          })
        const data = await response.json() // fetch the response from the server and store it in data as a json
        console.log(data) // log the data
        location.reload() //reload the dom on the current page.

    }catch(err){ // if an error catch it
        console.log(err) // log out the error caught above
    }
}

async function markUnComplete(){ //instantiate an asynchronous function called mark complete
    const itemText = this.parentNode.childNodes[1].innerText // creates a local constant function that takes in inner text from the child of the parent node.
    try{ // error try catch prevention
        const response = await fetch('markUnComplete', { // creates a local fetch for the mark complete from our server
            method: 'put', // this is a put request meaning we are adding data to the server or changing it
            headers: {'Content-Type': 'application/json'}, //Sets the content type as JSON
            body: JSON.stringify({ //converts the JSON type to a string
                'itemFromJS': itemText // itemText set as start of function from pulled data?
            })
          })
        const data = await response.json() // fetch the response from the server and store it in data as a json
        console.log(data) // log the data
        location.reload() //reload the dom on the current page.

    }catch(err){ // if an error catch it
        console.log(err) // log out the error caught above
    }
}