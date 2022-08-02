const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of all elements with a class of trash can
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection  spans with the parent class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans with a class of "competed" inside of a parent wiht a class of "item"

Array.from(deleteBtn).forEach((element)=>{ //makes an array from all delete buttons  
    element.addEventListener('click', deleteItem) // uses an array method to add an event listener to the current item that waits for a click and then calls a function called deleteItem 
}) //closing bracket

Array.from(item).forEach((element)=>{ // create an array from our selection and starting loop 
    element.addEventListener('click', markComplete) // add an event listener to the curret item that waits for a click and then calls a function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{ //creates an array from our selection and starts a loop 
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items
})

async function deleteItem(){ //declare an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of listed item and grabs only the inner text of the specified list item
    try{ // starting a try block 
        const response = await fetch('deleteItem', { // creating a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying type of content expected, which is JSON 
            body: JSON.stringify({ // declare the message content being passed, and stringify that contnet 
              'itemFromJS':itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })// closing our object
          }) //closing the object 
        const data = await response.json() //waiting on JSON from the response 
        console.log(data) // log the result to console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // starting a catch block and passing the error that occured, if an error occured.
        console.log(err) // console log the error 
    } //close the catch block
} // end the function

async function markComplete(){ // declare an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something 
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON 
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS' 
            })//closing the body 
          })// closing the object 
        const data = await response.json() // waiting on JSON from the response to be converted 
        console.log(data) // log the result to the console 
        location.reload() //reloads the page to update what is displayed 

    }catch(err){  // starting a catch block and passing the error that occured, if an error occured.
        console.log(err) //close the catch block
    } //close catch block
} //close function 

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // waiting on JSON from the response to be converted 
        console.log(data) // log the result to the console
        location.reload() //reloads the page to update what is displayed 

    }catch(err){ // catch block for if an error occurs 
        console.log(err) // console log the error
    } //close catch block
} // close function