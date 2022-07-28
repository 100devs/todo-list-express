const deleteBtn = document.querySelectorAll('.fa-trash') //sets variable and assigns it to a selection of all elementts with trashcan class in ejs
const item = document.querySelectorAll('.item span') //sets variable for spans that are children of class "item" in ejs
const itemCompleted = document.querySelectorAll('.item span.completed') //sets variable for spans that are children of item AND have a class of 'completed'

Array.from(deleteBtn).forEach((element)=>{ // creates an array from all the delete buttons and starts a loop to iterate through
    element.addEventListener('click', deleteItem) // adds event listener that runs function 'deleteItem' on click
}) //closes loop 

Array.from(item).forEach((element)=>{ // creates an array from all the spans with parent class of item and starts a loop to iterate through
    element.addEventListener('click', markComplete) //adds an event listener that will run the markComplete function when it is clicked
}) // closes loop.

Array.from(itemCompleted).forEach((element)=>{ // creates an array from all the spans with parent class of item that also have a class of 'Completed'and starts a loop to iterate through
    element.addEventListener('click', markUnComplete) // adds an event listener that will run the markUnComplete function when it is clicked.
}) // closes loop.

async function deleteItem(){ // declares an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText // extracts the text inside the specific list item and sets it to a variable
    try{ //declares a try block
        const response = await fetch('deleteItem', { //sets a response variable that waits on a fetch to get data from the result of 'deleteItem'
            method: 'delete', //sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // sets the type of content expected is JSON
            body: JSON.stringify({ // declares the message content being passed and stringifies it.
              'itemFromJS': itemText //sets the content of the body to be intertext of the list item and naming it 'itemFromJS'
            }) //closes the body
          }) //closes the object
        const data = await response.json() //waiting for the server to convert the response into json
        console.log(data) // console.logs the data
        location.reload() // refreshes the page to show changes

    }catch(err){ //declares catch block
        console.log(err) //console.logs the error
    } //closes the catch block
} //closes the function

async function markComplete(){ //declares asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // extracts the text inside the specific list item and sets it to a variable
    try{ //declares a try block
        const response = await fetch('markComplete', { //sets a response variable that waits on a fetch to get data from the result of 'markComplete'
            method: 'put', //sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // sets the type of content expected is JSON
            body: JSON.stringify({ // declares the message content being passed and stringifies it.
                'itemFromJS': itemText //sets the content of the body to be intertext of the list item and naming it 'itemFromJS'
            }) //closes the body
          }) //closes the object
        const data = await response.json() //waiting for the server to convert the response into json
        console.log(data) // console.logs the data
        location.reload() // refreshes the page to show changes

   }catch(err){ //declares catch block
        console.log(err) //console.logs the error
    } //closes the catch block
} //closes the function

async function markUnComplete(){ //sets an async function 
    const itemText = this.parentNode.childNodes[1].innerText // extracts the text inside the specific list item and sets it to a variable
    try{ //declares a try block
        const response = await fetch('markUnComplete', { //sets a response variable that waits on a fetch to get data from the result of 'markComplete'
            method: 'put', //sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // sets the type of content expected is JSON
            body: JSON.stringify({ // declares the message content being passed and stringifies it.
                'itemFromJS': itemText //sets the content of the body to be intertext of the list item and naming it 'itemFromJS'
            }) //closes the body
          }) //closes the object 
        const data = await response.json() //waiting for the server to convert the response into json
        console.log(data) // console.logs the data
        location.reload() // refreshes the page to show changes

     }catch(err){ //declares catch block
        console.log(err) //console.logs the error
    } //closes the catch block
} //closes the function