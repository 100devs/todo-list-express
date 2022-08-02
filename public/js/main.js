const deleteBtn = document.querySelectorAll('.fa-trash') //creates and assigns deleteBtn variable to all the trashcan icons in the index.ejs file
const item = document.querySelectorAll('.item span') //creates and assigns item variable to all span elements inside a parent element with a class of 'item' in the index.ejs file
const itemCompleted = document.querySelectorAll('.item span.completed') //creates and assigns itemCompleted variable to all span elements with a class of 'completed' inside a parent element with a class of 'item' in the index.ejs file

Array.from(deleteBtn).forEach((element)=>{ // creates an array of all the deleteBtn elements, and then loops through each one
    element.addEventListener('click', deleteItem) //adds a click event that calls the function deleteItem
}) //closes the forEach loop

Array.from(item).forEach((element)=>{ //creates an array of all the item elements and then loops through each one
    element.addEventListener('click', markComplete) //adds a click event that will call the markComplete function
}) //closes the forEach loop

Array.from(itemCompleted).forEach((element)=>{ //creates an array of all the itemCompleted elements and loops through each one
    element.addEventListener('click', markUnComplete) //adds a click event that calls the function markUnComplete
}) //closes the forEach loop

async function deleteItem(){ //declares asynchronous function named deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //assigns itemText variable to the text of the to-do list item that is having this function applied to it
    try{ //start of try block
        const response = await fetch('deleteItem', { //creates and assigns response variable to the result of fetching data from the 'deleteItem' route
            method: 'delete', //defines CRUD method for the route to 'delete'
            headers: {'Content-Type': 'application/json'}, // specifying type of content expected from fetch to equal json
            body: JSON.stringify({ // declares message content and converts it to a string from json
              'itemFromJS': itemText // setting the content of the body to itemText variable (inner text of list item) and naming it 'itemFromJS'
            }) //closes body 
          }) // closes object
        const data = await response.json() //assigns data variable to the value of the response variable once it is done fetching data and then converts the response to json
        console.log(data) //logs the data variable to the console
        location.reload() //reloads the page to display the change just made above - in this case, deleting an item

    }catch(err){ //end of try block, start of catch block with err parameter in case of errors
        console.log(err) //logs the err to the console
    }//end of catch block
} //end deleteItem function

async function markComplete(){ //declares asynchronous function named markComplete
    const itemText = this.parentNode.childNodes[1].innerText //creates and assigns itemText variable to the text of the to-do list item that the function is being applied to
    try{ //start of try block
        const response = await fetch('markComplete', { //creates and assigns response variable to the result of fetching data from the 'markComplete' route
            method: 'put', //defines CRUD method for the route as 'put'
            headers: {'Content-Type': 'application/json'}, // specifies the type of content expected from the fetch to equal json
            body: JSON.stringify({ // declares the body (message) content and converts it to a string from json
                'itemFromJS': itemText //sets the body content to itemText variable (inner text of list item) and names it 'itemFromJS'
            }) //closes body
          }) //closes object
        const data = await response.json() //creates and assigns data variable to the value of the response variable converted to json
        console.log(data) //logs the data to the console
        location.reload() //reloads the page to display the changes made - in this case, updating an item

    }catch(err){ //creates catch block in case of error
        console.log(err) //logs error to console
    } //closes catch block
} //end markComplete function

async function markUnComplete(){ //declares asynchronous function named markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //creates and assigns itemText variable to the text of the to-do list item that the function is being applied to
    try{ //start of try block
        const response = await fetch('markUnComplete', { //creates and assigns response variable to the result of fetching data from the 'markUnComplete' route
            method: 'put', //defines CRUD method for route as 'put'
            headers: {'Content-Type': 'application/json'}, //specifies the type of content expected from the fetch to equal json
            body: JSON.stringify({ //declares the body (message) content and converts it to a string from json
                'itemFromJS': itemText //sets the body content to equal the itemText variable and names it 'itemFromJS'
            }) //closes body
          }) //closes object
        const data = await response.json() //creates and declares data variable to the value of the response variable converted to json
        console.log(data) //log the data to the console
        location.reload() //reloads the page to display the changes made - in this case, updating an item

    }catch(err){ //start of catch block in case of errors
        console.log(err) //logs the error to the console
    } //closes catch block
} //end markUnComplete function