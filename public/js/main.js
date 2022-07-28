// this file is the client side Javascript for the web application
const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and selecting all the elemnts with the class of trash can, take all the trash can
const item = document.querySelectorAll('.item span') // creating a variable and assigning all spans that have a parent class of 'item' 
const itemCompleted = document.querySelectorAll('.item span.completed') //create a variable and assign it a selection of spans with class of "completed" inside of a parent with a class of "items"

Array.from(deleteBtn).forEach((element)=>{  //create an array from the deleteBtn query selectors, and use the foreach to start a loop
    element.addEventListener('click', deleteItem) //add an event listerner to the current item  that waits for a click and calls function deleteItem
}) //close our loop

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to the currrent item that waits for a click and calls a function called markComplete
}) //close our loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // add an event listener to only completed items which are tagged as completed 
}) //close our loop

async function deleteItem(){ // declaring an asynchronous function called deletItem, which will allow us to change the flow of the function and wait allow other codes to run outside the function 
    const itemText = this.parentNode.childNodes[1].innerText //creating a variable itemText and assigning it to the result of looking inside a list item and grabs only the innertext within the list span
    try{ // declaring a try block to do some action 
        const response = await fetch('deleteItem', { // sets the response variable that waits on a fetch to get data from result of deleteItem
            method: 'delete', //set the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //identifies the content type as json for the server, so you know the content type expected is JSON
            body: JSON.stringify({ //declare the message content being passed and stringify that content
              'itemFromJS': itemText //setting the content of the body and setting to the inner tex of the list item and name it "itemFromJS"
            }) //closing the body
          }) //closing the object 
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the function
} //end the function

async function markComplete(){ // declare an assync function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list to markcomplete route
    try{ // starting the try block to do. something
        const response = await fetch('markComplete', { // sets the response variable that waits on a fetch to get data from result of markComplete
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({// declare the message content of the bosy to the inner text of the list item, and naming it 'items from JS
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            })//closing the body
          }) //closing the object 
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if error occurs, pass the error into the catch block
        console.log(err)  //log the error to the console
    }//close the function
}//end the function

async function markUnComplete(){ // declaring an asynchronous function called markUncomplete, which will allow us to change the flow of the function and wait allow other codes to run outside the function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list to markcomplete route
    try{ // starting the try block to do. something
        const response = await fetch('markUnComplete', { // sets the response variable that waits on a fetch to get data from result of markUnComplete
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //identifies the content type as json for the server, so you know the content type expected is JSON
            body: JSON.stringify({ // declare the message content of the bosy to the inner text of the list item, and naming it 'items from JS
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            })//closing the body
          }) //closing the object 
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if error occurs, pass the error into the catch block
        console.log(err)  //log the error to the console
    }//close the function
}//end the function