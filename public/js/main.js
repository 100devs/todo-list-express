const deleteBtn = document.querySelectorAll('.fa-trash') //Creates a variable to assign all selected elements with a class name of fa-trash to it
const item = document.querySelectorAll('.item span') //Creates a variable to assign all selected span elements with a class name of item to it
const itemCompleted = document.querySelectorAll('.item span.completed') //Creates a variable to assign all selected span elements with the class names completed and item

Array.from(deleteBtn).forEach((element)=>{ //Creates an array from what was assigned to the deleteBtn variable and begins a loop via the forEach method
    element.addEventListener('click', deleteItem) //Adds an event listener that waits for a click and then call the deleteItem function
}) //Closes the loop

Array.from(item).forEach((element)=>{ //Creates an array from what was assigned to the item variable and begins a loop via the forEach method
    element.addEventListener('click', markComplete) //Adds an event listener that waits for a click and then call the markComplete function
}) //Closes the loop

Array.from(itemCompleted).forEach((element)=>{ //Creates an array from what was assigned to the itemCompleted variable and begins a loop via the forEach method
    element.addEventListener('click', markUnComplete) //Adds an event listener that waits for a click and then call the markUnComplete function
}) //Closes the loop

async function deleteItem(){ //Declares an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //Creates a variable and assigns inner text from the from the the 2nd span element within the list element
    try{ //Declares a try block to run the code below
        const response = await fetch('deleteItem', { //Creates a variable, waits on a fetch to get data from the deleteItem route, and assigns data to the variable
            method: 'delete', //Sets the CRUD method for the route as delete
            headers: {'Content-Type': 'application/json'}, //Specifies that JSON data will be returned
            body: JSON.stringify({ //Declares that data will be passed and converted into a JSON string 
              'itemFromJS': itemText //Sets content of the body to the inner text of the list item and names it itemFromJS
            })//Closes the body
          }) //Closes the object
        const data = await response.json() //Creates variable, waits on the response with JSON data, and assigns converted JSON to the variable.
        console.log(data)  //Prints what was assigned to data to the console
        location.reload() //Reloads the page and updates what's displayed

    }catch(err){  //Closes the try block and then declares a catch block to handle exceptions to the try block
        console.log(err) //Prints error to the console
    } //Closes the catch block
} //Closes the asynchronous function block

async function markComplete(){ //Declares an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //Creates a variable and assigns inner text from the from the the 2nd span element within the list element
    try{ //Declares a try block to run the code below
        const response = await fetch('markComplete', {  //Creates a variable, waits on a fetch to get data from the markComplete route, and assigns data to the variable
            method: 'put', //Sets the CRUD method for the route as put
            headers: {'Content-Type': 'application/json'}, //Specifies that JSON data will be returned
            body: JSON.stringify({ //Declares that data will be passed and converted into a JSON string 
                'itemFromJS': itemText //Sets content of the body to the inner text of the list item and names it itemFromJS
            }) //Closes the body
          }) //Closes the object
        const data = await response.json() //Creates variable, waits on the response with JSON data, and assigns converted JSON to the variable.
        console.log(data) //Prints what was assigned to data to the console
        location.reload() //Reloads the page and updates what's displayed

    }catch(err){ //Closes the try block and declares a catch block to handle exceptions to the try block
        console.log(err) //Prints error to the console
    } //Closes the catch block
} //Closes the asynchronous function block

async function markUnComplete(){ //Declares an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText ////Creates a variable and assigns inner text from the from the the 2nd span element within the list element
    try{ //Declares a try block to run the code below
        const response = await fetch('markUnComplete', { //Creates a variable, waits on a fetch to get data from the markUncomplete route, and assigns data to the variable
            method: 'put', //Sets the CRUD method for the route as put
            headers: {'Content-Type': 'application/json'}, //Specifies that JSON data will be returned
            body: JSON.stringify({ //Declares that data will be passed and converted into a JSON string 
                'itemFromJS': itemText //Sets content of the body to the inner text of the list item and names it itemFromJS
            }) //Closes the body
          }) //Closes the object
        const data = await response.json() //Creates variable, waits on the response with JSON data, and assigns converted JSON to the variable.
        console.log(data) //Prints what was assigned to data to the console
        location.reload() //Reloads the page and updates what's displayed

    }catch(err){ //Closes the try block and declares the catch block to handle exceptions to the try block
        console.log(err) //Prints error message to the console
    } //Closes the catch block
} //Closes the asynchronous function block