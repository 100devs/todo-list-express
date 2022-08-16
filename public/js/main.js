const deleteBtn = document.querySelectorAll('.fa-trash') //Selects all trashcan icons (elements with fa-trash class) and save them in a variable.
const item = document.querySelectorAll('.item span') //Selects all todo items (span tags within elements with item class) that have not been completed yet and saves them in a variable.
const itemCompleted = document.querySelectorAll('.item span.completed') //Selects all todo items that have been compeleted (span tags with completed class within elements with item class) and saves them in a variable.

//Puts all delete buttons into an array and loops through them 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //adding an event listener to each that would call the function deleteItem when/if element clicked.
}) //Close loop

//Puts all uncompleted todo items into an array and loops through them
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)  //adding an event listener to each that would call the function markComplete when/if element clicked.
}) //Close loop

//Puts all completed todo items into an array and loops through
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //adding an event listener to each that would call the function markUnComplete when/if element clicked.
}) //Close loop

//Declare an asynchronous function that is called when a delete button is being clicked.
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText   //Selects the text of the todo item whose delete button was clicked and saves it in a variable.
    try{     //start of try block in a try-catch error handling structure 
        const response = await fetch('deleteItem', {  //waits for a fetch request that retrieves data from the deleteItem route and saves its result in the variable response.
            method: 'delete',   // declares the method of the fetch to delete
            headers: {'Content-Type': 'application/json'},  //declares the header to specify the content type expected to be json
            body: JSON.stringify({  //declares the body content to be stringified to json.
              'itemFromJS': itemText //declares the content to be passed to be the todo item text and giving it the name itemFromJS
            }) //Close the fetch data object
          }) //Close the whole fetch request
        const data = await response.json()  //waits for the response of the fetch to come back in json form.
        console.log(data)  //displays the data coming back in the response to the console.
        location.reload()  //Refreshes the web page to redisplay the updated todo list 

    }catch(err){           //Start of Catch block in the try-catch error handling structure (if an error occurs in try block catch it and pass it to this block to be handled).
        console.log(err)   //Displays the caught error to the console. 
    } //Close catch block
}  //Close the asynchronous function

//Declare an asynchornous function that is called when an uncompleted todo item has been clicked so that it can mark it as complete. 
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText   //Selects the uncompleted todo item text and saves it in a variable.
    try{      //Start of try block
        const response = await fetch('markComplete', {  //waits for a fetch request to retrieve data from the markcomplete route and saves its result in a variable. 
            method: 'put',   //Declares the fetch request method to put (update)
            headers: {'Content-Type': 'application/json'},  //Declares the header to specify that the content type will be json.
            body: JSON.stringify({  //declares the body content to be stringified to json. 
                'itemFromJS': itemText //declares the content to be passed to be the uncompleted todo item text and giving it the name itemFromJS
            }) //Close the fetch data object
          }) //Close the whole fetch request
        const data = await response.json()  //waits for the response of the request to come back with the data into json form.
        console.log(data)  //Displays the data to the console.
        location.reload()  //Refreshes the web page to display the updated todo list.

    }catch(err){           //Start of catch block (if an error occurs in try block catch it and pass it to this block to be handled).
        console.log(err)   //Displays the caught error to the console. 
    } //Close the Catch block
} //Close the asynchronous function

//Declare an asynchornous function that is called when an completed todo item has been clicked so that it can mark it as uncomplete. 
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //Selects the uncompleted todo item text and saves it in a variable.
    try{ //Start of try block 
        const response = await fetch('markUnComplete', { //waits for a fetch to retrieve data from the markUncomplete route and saves its result in a variable. 
            method: 'put', //Declares the fetch request method to put (update)
            headers: {'Content-Type': 'application/json'},  //Declares the header to specify that the content type will be json.
            body: JSON.stringify({ //declares the body content to be stringified to json.
                'itemFromJS': itemText  //declares the content to be passed to be the completed todo item text and giving it the name itemFromJS
            })  //Close the fetch data object
          }) //Close the whole fetch request
        const data = await response.json() //waits for the response of the request to come back with the data into json form.
        console.log(data) //Displays the data to the console.
        location.reload() //Refreshes the web page to display the updated todo list.

    }catch(err){ //Start of catch block (if an error occurs in try block catch it and pass it to this block to be handled).
        console.log(err) //Displays the caught error to the console. 
    }  //Close the Catch block.
} //Close the asynchronous function