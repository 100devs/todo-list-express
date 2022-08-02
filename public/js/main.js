// create a variable deleteBtn and assign it to all elements with class of fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
//create a varible item assign it to all span tags within a parent element with item class
const item = document.querySelectorAll('.item span')
//create a variable itemCompleted assign it to all span with completed class within a parent element with class item
const itemCompleted = document.querySelectorAll('.item span.completed')
// creating an array from deleteBtn and loops through them
Array.from(deleteBtn).forEach((element) => {
    // add eventlisteners to current element in the array that waits for a  click and calls the function deleteItem
    element.addEventListener('click', deleteItem)
    // close loop
})

// creat an array from item selection and looping through it
Array.from(item).forEach((element) => {
    // add eventlistners to current element in array waits for click and calls the function markComplete
    element.addEventListener('click', markComplete)
    // close loop
})

// create an array from itemCompleted selection and loops through it
Array.from(itemCompleted).forEach((element) => {
    // add eventlisteners to current element in the array waits for click and calls the function markUnComplete
    element.addEventListener('click', markUnComplete)
    // close loop
})

async function deleteItem() { //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list and grabs only the inner text within the list span.
    try {//start a try block to do something
        const response = await fetch('deleteItem', { //create a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete',//starting an object and sets the CRUD method for the route
            headers: { 'Content-Type': 'application/json' },//specifing the type of content expecting is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            })//CLOSING THE BODY
        })//closing the object
        const data = await response.json()//waiting on JSON from the response to be converted
        console.log(data) //displaying data on the console
        location.reload()//reloads the page to update what is displayed

    } catch (err) { //if an error occurs, pass it into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//end the function

async function markComplete() {//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span
    try {//starting a try block to do something
        const response = await fetch('markComplete', {//creates a resoinse variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: { 'Content-Type': 'application/json' },//specify the type of content expected, which is json
            body: JSON.stringify({//declare the message content being passed, and stringify that content
                'itemFromJS': itemText// setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body
        })//closing the object
        const data = await response.json()//waiting on json from the response to be converted
        console.log(data)//log the result to the console
        location.reload()//reloads the page to update what is displayed

    } catch (err) {//if an error occurs, pass it into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//end the function

async function markUnComplete() {//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span
    try {//starting a try block to do something
        const response = await fetch('markUnComplete', {//creates a resoinse variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: { 'Content-Type': 'application/json' },//specify the type of content expected, which is json
            body: JSON.stringify({//declare the message content being passed, and stringify that content
                'itemFromJS': itemText// setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body
        })//closing the object
        const data = await response.json()//waiting on json from the response to be converted
        console.log(data)//log the error to the console
        location.reload()//reloads the page to update what is displayed

    } catch (err) {//if an error occurs, pass it into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//end the function