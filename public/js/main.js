const deleteBtn = document.querySelectorAll('.fa-trash') //create a variable, assign to a selection of all elements with a class of "fa-trash"
const item = document.querySelectorAll('.item span') //create a variable, assign to a selection of span tags inside a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //create a variable, assign to a selection of spans with a class of "completed" inside a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ //create an array from selection, start a loop
    element.addEventListener('click', deleteItem) //add an event listener to current item that waits for a click, once clicked, calls function "deleteItem"
}) //close loop

Array.from(item).forEach((element)=>{ //create an array from selection, start loop
    element.addEventListener('click', markComplete) //add an event listener to current item that waits for a click, once clicked, calls function "markComplete"
}) //close loop

Array.from(itemCompleted).forEach((element)=>{ //create an array from selection, start loop
    element.addEventListener('click', markUnComplete) //add an event listener to current item that waits for a click, once clicked, calls function "markUnComplete"
}) //close loop

async function deleteItem(){ //declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //look inside of list item to extract text value only of the specified list item
    try{ //declare a try block
        const response = await fetch('deleteItem', { //create a response variable that waits on a fetch to get data from the result of "deleteItem" route
            method: 'delete', //set CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specify type of content expected (JSON)
            body: JSON.stringify({ //declare the message content being passed and turn into a string
              'itemFromJS': itemText //set the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //close body
          }) //close object
        const data = await response.json() //wait on JSON converstion from the response
        console.log(data) //log data to console
        location.reload() //refresh page to update display

    }catch(err){ //declare catch block, if an error occurs, pass into the catch block
        console.log(err) //log error to console
    } //close catch block
} //end function

async function markComplete(){ //declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //look inside of list item to extract text value only of the specified list item
    try{ //declare a try block
        const response = await fetch('markComplete', { //create a response variable that waits on a fetch to get data from the result of "markComplete" route
            method: 'put', //set CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specify type of content expected (JSON)
            body: JSON.stringify({ //declare the message content being passed and turn into a string
                'itemFromJS': itemText //set the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //close body
          }) //close object
        const data = await response.json() //wait on JSON converstion from the response
        console.log(data) //log data to console
        location.reload() //refresh page to update display

    }catch(err){ //declare catch block, if an error occurs, pass into the catch block
        console.log(err) //log error to console
    } //close catch block
} //end function

async function markUnComplete(){ //declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //look inside of list item to extract text value only of the specified list item
    try{ //declare a try block
        const response = await fetch('markUnComplete', { //create a response variable that waits on a fetch to get data from the result of "markUnComplete" route
            method: 'put', //set CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specify type of content expected (JSON)
            body: JSON.stringify({ //declare the message content being passed and turn into a string
                'itemFromJS': itemText //set the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //close body
          }) //close object
        const data = await response.json() //wait on JSON converstion from the response
        console.log(data) //log data to console
        location.reload() //refresh page to update display

    }catch(err){ //declare catch block, if an error occurs, pass into the catch block
        console.log(err) //log error to console
    } //close catch block
} //end function