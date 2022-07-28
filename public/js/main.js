const deleteBtn = document.querySelectorAll('.fa-trash') //create a variable and assign it to a selection of all elements with "trash can" class
const item = document.querySelectorAll('.item span') //create a variable and assign it to a selection of span tags inside a parent with the "item" class
const itemCompleted = document.querySelectorAll('.item span.completed') //create a variable and assign it to a selection of spans with a "completed" class inside of parent with the "item" class

Array.from(deleteBtn).forEach((element)=>{ //create array from our selection and start a loop
    element.addEventListener('click', deleteItem) //add event listener to teh current item that waits for a click and calls a function called deleteItem
}) //close the loop

Array.from(item).forEach((element)=>{ //create an array from our selection and start a loop
    element.addEventListener('click', markComplete) //add event listener to current item that waits for click and calls function called markComplete
}) //close the loop

Array.from(itemCompleted).forEach((element)=>{ //
    element.addEventListener('click', markUnComplete) //add event listener to only the completed items
}) //close the loop
async function deleteItem(){ //declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item to extract inner text only within the list span
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //create a response variable that waits on a fetch to get data from result of the deleteItem route
            method: 'delete', //sets CRUD method or route
            headers: {'Content-Type': 'application/json'}, //specifies type of content expected, which is JSON
            body: JSON.stringify({ //declare message content being passed and stringify that content
              'itemFromJS': itemText //set the content of the body to the inner text of the list item, and name it 'itemFromJS'
            }) //close body
          }) //close the object
        const data = await response.json() //wait on JSON from the response to be converted
        console.log(data) //log result to the console
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if error occurs, pass the error to the catch block
        console.log(err) //log error to the console
    }//close catch block
} //close the asynchronous function

async function markComplete(){ //declare asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item and grabs only inner text within the list span
    try{ //start a try block to do something
        const response = await fetch('markComplete', { //create response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', //set the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specify the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and stringify it
                'itemFromJS': itemText //set the content of the body to the inner text of the list item, and name it 'itemFromJS'
            }) //close the body
          }) //close the object
        const data = await response.json() //wait on JSON from the response to be converted
        console.log(data) //log result to the console
        location.reload() //reload page to update what is displayed

    }catch(err){ //if error occurs, pass the error into the catch block
        console.log(err) //log error to the console
    }//close catch block
} //close the function

async function markUnComplete(){ //declare an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item and grabs only inner text within the list span.
    try{ //start a try block to do something
        const response = await fetch('markUnComplete', { //create a response variable that waits on fetch to get data from the result of the markUnComplete route
            method: 'put', //set the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specify type of content expected, which is JSON
            body: JSON.stringify({ //declare message content being passed and stringify it
                'itemFromJS': itemText //set the content of the body to inner text of the list item and name is "itemFromJS"
            }) //close the body 
          }) //close the object
        const data = await response.json() //wait on JSON from the response to be converted
        console.log(data) //log result to the console
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if error occurs, pass the error into the catch block
        console.log(err) //log error to the console
    } //close catch block
} //close the function