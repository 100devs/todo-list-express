const deleteBtn = document.querySelectorAll('.fa-trash') //create a variable and assigning it to a selection of all elements with the class of the trash can
const item = document.querySelectorAll('.item span') //create a variable and assigning it to a selection of span tags inside of a parent that has a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //create variable and assigning it to a selection of span with the class of completed inside of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{ //creat an array from our selection and start a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click and then call a function called deleteItem
})//close loop

Array.from(item).forEach((element)=>{ //create an array from our selection and start a loop
    element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click and then call a function called markComplete
})//close loop

Array.from(itemCompleted).forEach((element)=>{ //create an array from our selection and start a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items
})//close loop

async function deleteItem(){ //create an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span 
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creates response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if an error occurs pass the error into the catch block
        console.log(err) //log the error to the console
    } //close catch
} //close function

async function markComplete(){ //create an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span 
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', //sets the CRUD method for the route, update
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if an error occurs pass the error into the catch block
        console.log(err) //log the error to the console
    } //close catch
} //close function

async function markUnComplete(){ //create an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span 
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creates response variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if an error occurs pass the error into the catch block
        console.log(err) //log the error to the console
    } //close catch
} //close function