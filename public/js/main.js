const deleteBtn = document.querySelectorAll('.fa-trash') //selecting all elements with the class of fa-trash and assigning it to the deletebtn variable
const item = document.querySelectorAll('.item span') //selecting all elements with a span tags inside a parent with an item class and assigning it to the variable item
const itemCompleted = document.querySelectorAll('.item span.completed') //selecting all completed spans inside a parent with a class of item and assigning it to the variable item completed

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //add a click event listener to the current item. Waits for a click and calls function called delete item
}) //close our loop

Array.from(item).forEach((element)=>{ //create an array from our selection and srarting a loop 
    element.addEventListener('click', markComplete) //adds a alick event listener to the current item. Waits for a click and calls function called markComplete
}) //close our loop 

Array.from(itemCompleted).forEach((element)=>{ //create an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adds a click event listener to only completed items. waits for a click and calls the function markUncomplete
})

async function deleteItem(){ //declaring an async function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the innerText within the list span
    try{ //declare a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch from the results of a delete item route
            method: 'delete', //selets CRUD method to the route
            headers: {'Content-Type': 'application/json'}, //letting the client know that the data we should expect should be json
            body: JSON.stringify({ //declare the message content being passed and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it item from js
            }) //closing the body
          }) //closing the object
        const data = await response.json() //creating a variable that is waiting for the response and converts it to json
        console.log(data) //log data to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the erro into the catch block
        console.log(err) //log the error in the console
    } //close catch block
} //close asnc function

async function markComplete(){ //declaring async function called mark complete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the innerText within the list span
    try{ //declare a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch from the results of a markComplete route
            method: 'put', //setting the CRUD method to Update for the route
            headers: {'Content-Type': 'application/json'}, //letting the client know that the data we should expect should be json
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it item from js
            })//closing the body
          })//closing the object
        const data = await response.json()  //creating a variable that is waiting for the response and converts it to json
        console.log(data)//log data to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){//if an error occurs, pass the erro into the catch block
        console.log(err)//log the error in the console
    } //close catch block
}//close asnc function

async function markUnComplete(){//declaring async function called markUnomplete
    const itemText = this.parentNode.childNodes[1].innerText 
    try{ //declare a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch from the results of a markUncomplete route
            method: 'put', //setting the CRUD method to Update for the route
            headers: {'Content-Type': 'application/json'}, //letting the client know that the data we should expect should be json
            body: JSON.stringify({//declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it item from js
            })//closing the body
          })//closing the object
        const data = await response.json() //creating a variable that is waiting for the response and converts it to json
        console.log(data)//log data to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){//if an error occurs, pass the erro into the catch block
        console.log(err)//log the error in the console
    }//close catch block
}//close asnc function