const deleteBtn = document.querySelectorAll('.fa-trash') //Create variable of a collection of elements with the class of .fa-trash
const item = document.querySelectorAll('.item span') //Create variable and assigning it to a selection of spans inside .item
const itemCompleted = document.querySelectorAll('.item span.completed') //Create a variable and assigning to a selection of spans, with the class of .item, with the class of .completed

Array.from(deleteBtn).forEach((element)=>{ //creating an array of our selection and starting a loop
    element.addEventListener('click', deleteItem) //Adding event listener to every element, on click and call with function deleteItem 
}) //Close Loop

Array.from(item).forEach((element)=>{ //creating an array of our selection and starting a loop
    element.addEventListener('click', markComplete) //Adding event listener to every element, on click and call function markComplete
}) //Close Loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array of our selection and starting a loop
    element.addEventListener('click', markUnComplete) //Adding event listener to every element, on click and call function markUnomplete
}) //Close Loop

async function deleteItem(){ //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of list item and grabs only the innerText within the list span.
    try{  //Declare a try block to do something
        const response = await fetch('deleteItem', { //Create a variable that waits on a fetch to get data from result of the deleteItem route
            method: 'delete', //Set the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //Specifying the expected content type, JSON
            body: JSON.stringify({ // body oroperty of the request object and stringify
              'itemFromJS': itemText //setting content of body to the innertext of the list item, and naming it 'iteFromJS
            }) //closing body
          }) //closing object
        const data = await response.json() //waited JSON from the response to be converted
        console.log(data) //log data to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end function

async function markComplete(){//declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of list item and grabs only the innerText within the list span.
    try{ //Declare a try block to do something
        const response = await fetch('markComplete', {  //Create a variable that waits on a fetch to get data from result of the markComplete route
            method: 'put', //Set the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, //Specifying the expected content type, JSON
            body: JSON.stringify({ // body oroperty of the request object and stringify
                'itemFromJS': itemText  //setting content of body to the innertext of the list item, and naming it 'iteFromJS
            })//closing body
          }) //closing object
        const data = await response.json() //waited JSON from the response to be converted
        console.log(data) //log data to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//close the catch block
}//end function

async function markUnComplete(){ //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of list item and grabs only the innerText within the list span.
    try{ //Declare a try block to do something
        const response = await fetch('markUnComplete', { //Create a variable that waits on a fetch to get data from result of the markUnComplete route
            method: 'put', //Set the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, //Specifying the expected content type, JSON
            body: JSON.stringify({  // body oroperty of the request object and stringify
                'itemFromJS': itemText //setting content of body to the innertext of the list item, and naming it 'iteFromJS
            }) //closing body
          }) //closing object
        const data = await response.json() //waited JSON from the response to be converted
        console.log(data) //log data to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end function