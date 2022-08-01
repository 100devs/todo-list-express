const deleteBtn = document.querySelectorAll('.fa-trash') //Creates a variable of deleteBtn and assigns it to select class of fa-trash
const item = document.querySelectorAll('.item span') //creates a variable and assigns it to a selection of span tags inside of a parent with a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creates a variable and assigns it to a selection of spans with a class of compelted inside of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{ //creating an array from the selection and starting a loop
    element.addEventListener('click', deleteItem) //adds an event listener to the current item and waits for a click and calls a function called deleteItem
}) //Closes the loop

Array.from(item).forEach((element)=>{ //Creates an array from our selection and starts a loop
    element.addEventListener('click', markComplete) //adds an event listener to the current item and waits for a click and calls a function called markComplete
}) //closes the loop

Array.from(itemCompleted).forEach((element)=>{ //Creates an array from our selection and starts a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items
}) //closes the loop

async function deleteItem(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //checks inside of the list item and grabs inner text within the span
    try{ //Starts try block
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //Sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //Specifies the type of content expected which in this case is JSON
            body: JSON.stringify({ //Declare message content being passed and stringify that content
              'itemFromJS': itemText //Sets content of body as inner text of list item and names it itemFromJS
            }) //closes the body
          }) //closes the object
        const data = await response.json() //Waiting on JSON from response
        console.log(data) //logs result returned to console
        location.reload() //reloads page to update what is displayed 

    }catch(err){ //if error occurs, pass it into the catch block
        console.log(err) //logs error to console
    } //close catch block
} //ends function

async function markComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //checks inside of the list item and grabs inner text within the span
    try{ //Starts try block
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //Sets the CRUD method to UPDATE the route
            headers: {'Content-Type': 'application/json'}, //Specifies the type of content expected which in this case is JSON
            body: JSON.stringify({ //Declare message content being passed and stringify that content
                'itemFromJS': itemText //Sets content of body as inner text of list item and names it itemFromJS
            }) //closes the body
          }) //closes the object
        const data = await response.json() //Waiting on JSON from response
        console.log(data) //logs result returned to console
        location.reload() //reloads page to update what is displayed 

    }catch(err){ //if error occurs, pass it into the catch block
        console.log(err) //logs error to console
    } //close catch block
} //ends function

async function markUnComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //checks inside of the list item and grabs inner text within the span
    try{ //Starts try block
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //Sets the CRUD method to UPDATE the route
            headers: {'Content-Type': 'application/json'}, //Specifies the type of content expected which in this case is JSON
            body: JSON.stringify({ //Declare message content being passed and stringify that content
                'itemFromJS': itemText //Sets content of body as inner text of list item and names it itemFromJS
            }) //closes the body
          }) //closes the object
        const data = await response.json() //Waiting on JSON from response
        console.log(data) //logs result returned to console
        location.reload() //reloads page to update what is displayed 

    }catch(err){ //if error occurs, pass it into the catch block
        console.log(err) //logs error to console
    } //close catch block
} //ends function