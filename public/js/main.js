const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable that selects all elements with class .fa-trash
const item = document.querySelectorAll('.item span')//creating a variable that selects all span tags undeer the item class
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable and assigning it to a selection of spans with a class of completed inside of a parent with class 'item'

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)//add event listener to the current item that waits for a click and then calls the deleteItem function
})//close loop

Array.from(item).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete)//event listener to the current item that waits for a click and then calls the markComplete function
})//close loop

Array.from(itemCompleted).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)//event listener to the current item that waits for a click and then calls the markunComplete function to only completed items
})//close loop

async function deleteItem(){//declaring asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item to extract the text value only of the specified list item
    try{//starting try catch block
        const response = await fetch('deleteItem', { //creates a variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', //sets the CRUD method to 'delete' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText  //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body
          })//closing the object
        const data = await response.json()//waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into catch blocks
        console.log(err)//log the error to the console
    }//close the catch block
}//close the async function

async function markComplete(){ //declare an async function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item to extract the text value only of the specified list item
    try{ //starting try catch block
        const response = await fetch('markComplete', { //creates a variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', //sets the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //close the body
          }) //close the object
          const data = await response.json()//waiting on JSON from the response to be converted
          console.log(data) //log the result to the console
          location.reload() //reloads the page to update what is displayed  

    }catch(err){ //if an error occurs, pass the error into catch blocks
            console.log(err)//log the error to the console
    }//close the catch block
}//close the async function

async function markUnComplete(){ //declare an async function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item to extract the text value only of the specified list item
    try{ //starting try catch block
        const response = await fetch('markUnComplete', { //creates a variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put', //sets the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//close the body
          })//close the object
          const data = await response.json()//waiting on JSON from the response to be converted
          console.log(data) //log the result to the console
          location.reload() //reloads the page to update what is displayed  

    }catch(err){ //if an error occurs, pass the error into catch blocks
            console.log(err)//log the error to the console
    }//close the catch block
}//close the async function