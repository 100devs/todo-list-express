const deleteBtn = document.querySelectorAll('.fa-trash') //setting a variable that grabs the trash can icon
const item = document.querySelectorAll('.item span') //setting a variable that grabs the span with items
const itemCompleted = document.querySelectorAll('.item span.completed') //setting a variable that grabs the selection of spans with a class of 'completed' inside of a parent with a class of 'items'

Array.from(deleteBtn).forEach((element) => { //creating an array from our selection and staring a loop
    element.addEventListener('click', deleteItem) //adds event listener to the current item that waits for a click and then calls the 'deleteItem' function
}) //close loop

Array.from(item).forEach((element) => { //creating an array from our selection and staring a loop
    element.addEventListener('click', markComplete) //adds event listener to the current item that waits for a click and then calls the 'markComplete' function
}) //close loop

Array.from(itemCompleted).forEach((element) => { //creating an array from our selection and staring a loop
    element.addEventListener('click', markUnComplete) //adds event listener to the current item that waits for a click and then calls the 'markUnComplete' function
}) //close loop

async function deleteItem() { //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list items and grabs only the inner text within the list span
    try { //starting a try block that allows us to do something
        const response = await fetch('deleteItem', { //setting a response variable that waits for the retrival of data from the result of the deleteItem route, we are also starting an object
            method: 'delete', //sets the CRUD method for the route
            headers: { 'Content-Type': 'application/json' }, //specifying teh type of content expected, in this case is json
            body: JSON.stringify({ //declare the message content being passed and turn it into a string
                'itemFromJS': itemText //itemText is innerText. We're setting the content of the body to the inner text of the item and naming that 'itemFromJS'
            }) //closing the body
        }) //closing the object
        const data = await response.json() //setting a variable called that that waits for the server to respond with some json
        console.log(data) //loging the response
        location.reload() //refreshes the page to update what is displayed

    } catch (err) { //if error occurs pass error into catch block
        console.log(err) //log error
    }//close catch block
} //end of function

async function markComplete() { //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list items and grabs only the inner text within the list span
    try {//starting a try block that allows us to do something
        const response = await fetch('markComplete', { //setting a response variable that waits for the retrival of data from the result of the markComplete route, we are also starting an object
            method: 'put', //sets the CRUD method for the route, put means update
            headers: { 'Content-Type': 'application/json' }, //specifying teh type of content expected, in this case is json
            body: JSON.stringify({ //declare the message content being passed and turn it into a string
                'itemFromJS': itemText //We're setting the content of the body to the inner text of the item and naming that 'itemFromJS'
            }) //closing body
        }) //closing object
        const data = await response.json() //setting a variable called that that waits for the server to respond with some json
        console.log(data) //loging the response
        location.reload() //refreshes the page to update what is displayed

    } catch (err) { //if error occurs pass error into catch block
        console.log(err) //log error
    }//close catch block
}//end of function

async function markUnComplete() { //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list items and grabs only the inner text within the list span
    try { //starting a try block to do something
        const response = await fetch('markUnComplete', { //setting a response variable that waits for the retrival of data from the result of the markUnComplete route, we are also starting an object
            method: 'put', //sets the CRUD method for the route, put means update
            headers: { 'Content-Type': 'application/json' }, //specifying teh type of content expected, in this case is json
            body: JSON.stringify({ //declare the message content being passed and turn it into a string
                'itemFromJS': itemText //setting the content of the body to the inner text of the item and naming that 'itemFromJS'
            }) //closing body
        }) //closing object
        const data = await response.json()
        console.log(data) //loging the response
        location.reload() //refreshes the page to update what is displayed

    } catch (err) { //if error occurs pass error into catch block
        console.log(err) //log error
    }//close catch block
} //end of function