const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and sasssinging it to a selection of all elements with a class of trash can 
const item = document.querySelectorAll('.item span') //creating a variable and asssinging it to a selection of span tags insde of a parent that has a classs of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and sasssinging it to a selection of span with a class of completed inside of a parent with a class of item

Array.from(deleteBtn).forEach((element) => { //creating an array from our selection and startin a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click and then calls a function called deletion
})//close our loop

Array.from(item).forEach((element) => { //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click and then calls a function called markComplete
})//close our loop

Array.from(itemCompleted).forEach((element) => { //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //add an event listener to the current item that waits for a click and then calls a function called markUnComplete
})//close our loop

async function deleteItem() { //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list items and grabs only the inner text within the list span
    try { //declaring a try block
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', //sets the crud method for the route
            headers: { 'Content-Type': 'application/json' }, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS' 
            })//closing the body
        })//closing the object
        const data = await response.json() //waiting json from the response to be converted
        console.log(data) //log the data to the console 
        location.reload()//reloads the page to update what is displayed

    } catch (err) { //if a error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//close the catch block
}//end the function

async function markComplete() { //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list items and grabs only the inner text within the list span
    try { //declaring a try block
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', //sets the crud method for the route
            headers: { 'Content-Type': 'application/json' }, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS' 
            })//closing the body
        })//closing the object
        const data = await response.json() //waiting json from the response to be converted
        console.log(data) //log the data to the console 
        location.reload()//reloads the page to update what is displayed

    } catch (err) { //if a error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//close the catch block
}//end the function

async function markUnComplete() { //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list items and grabs only the inner text within the list span
    try { //declaring a try block
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put', //sets the crud method for the route
            headers: { 'Content-Type': 'application/json' }, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS' 
            })//closing the body
        })//closing the object
        const data = await response.json() //waiting json from the response to be converted
        console.log(data) //log the data to the console 
        location.reload()//reloads the page to update what is displayed

    } catch (err) { //if a error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//close the catch block
}//end the function