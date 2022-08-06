// select all the delete buttons, to-do items (as long as they're also a span), and completed items (also must be a span)
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// create arrays of all the delete buttons, to-items, and completed to-do items and performs relevant method when they are clicked,
// ie. clicking a delete button deletes the selected item, clicking a list item marks it as complete, and clicking a completed item uncompletes it
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

// deletes an item
async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText    // selects innerText element of child node at index 1 of the delete button's object
    //try-catch blocks attempt the code within the try block, but if it doesn't work, they run the catch block code using the error as a callback
    try {
        const response = await fetch('deleteItem', {    //call the deleteItem route from the server 
            method: 'delete',   // pass it the delete method
            headers: { 'Content-Type': 'application/json' },  // passes this info as json
            body: JSON.stringify({  // turns the following  data into a JSON string
                'itemFromJS': itemText    // sets 'itemFromJS' to the selected item's text, which is the thing to be deleted by the deleteItem path
            })
        })
        const data = await response.json()  // waits for a response from deleteMethod before continuting and puts it into data so that it can be logged or otherwise used
        console.log(data)
        location.reload()   // reloads the page

    } catch (err) {
        console.log(err)    // logs any errors that the catch block catches
    }
}

async function markComplete() {
    const itemText = this.parentNode.childNodes[1].innerText // selects innerText element of child node at index 1 of a todo item's object
    //try-catch blocks attempt the code within the try block, but if it doesn't work, they run the catch block code using the error as a callback
    try {
        const response = await fetch('markComplete', {  // call the markComplete route from the server
            method: 'put',  // pass it the put method
            headers: { 'Content-Type': 'application/json' },  // passes this info as JSON
            body: JSON.stringify({  // turns the following data into a JSON string
                'itemFromJS': itemText  // sets 'itemFromJS' to the selected items text, which is the item to be found and set to complete
            })
        })
        const data = await response.json()  // waits for a response from markComplete, then puts that response into the variable 'data'
        console.log(data)   // logs the data variable
        location.reload()   // reloads the page

    } catch (err) {
        console.log(err)    // logs any errors the catch block catches
    }
}

async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText // selects innerText element of child node at index 1 of a todo item's object
    //try-catch blocks attempt the code within the try block, but if it doesn't work, they run the catch block code using the error as a callback
    try {
        const response = await fetch('markUnComplete', {    // call the markUnComplete route from server
            method: 'put',  // pass it the put method
            headers: { 'Content-Type': 'application/json' },  // passes this data as JSON 
            body: JSON.stringify({  // turns the following data into a JSON string
                'itemFromJS': itemText  // sets 'itemFromJS' to the selected item's text
            })
        })
        const data = await response.json()  // waits for a response from the server and puts it into the variable 'data'
        console.log(data)   // logs the server's response
        location.reload()   // reload the page

    } catch (err) {
        console.log(err)    // logs any erros the catch block catches
    }
}