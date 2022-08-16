// NOTE: These kinds of comments on index.js might be affecting the parent-child node relationship when extracting text from the async functions
const deleteBtn = document.querySelectorAll('.fa-trash') // variable referencing span tags with class 'fa-trash' (i.e. fontawesome trash icons)
const item = document.querySelectorAll('.item span') // variable referencing span tags inside list item tags with class 'item' (note: also includes trash icons)
const itemCompleted = document.querySelectorAll('.item span.completed') // variable referencing span tags with class 'completed' inside list item tags with class 'item'

Array.from(deleteBtn).forEach((element) => { // for each 'fa-trash' span element from copy of deleteBtn array
    element.addEventListener('click', deleteItem) // add event listener to element which calls function 'deleteItem' on click event
})

Array.from(item).forEach((element) => { // for every span element inside list items with class 'item' from copy of item array
    element.addEventListener('click', markComplete) // add event listener to element which calls function 'markComplete' on click event
})

Array.from(itemCompleted).forEach((element) => { // for every span element with class 'completed' inside list items with class 'item' from copy of itemCompleted array
    element.addEventListener('click', markUnComplete) // add event listener to element which calls function 'markUnComplete' on click event
})

async function deleteItem() { // asynchronous function to delete a todo
    const itemText = this.parentNode.childNodes[1].innerText // extract text inside second child of clicked element's parent (presumably inside span?)

    try { // try request to delete
        const response = await fetch('deleteItem', { // create variable for potential data from delete request
            method: 'delete', // sets CRUD method for route to delete list item data
            headers: {'Content-Type': 'application/json'}, // specifies content type (JSON)
            body: JSON.stringify( {'itemFromJS': itemText} ) // declares message content (text from presumably list item span) converted from JSON to string
          })
        const data = await response.json() // create variable for potential result in JSON
        location.reload() // reload page to display updated results
        console.log(data) // log potential result in JSON
    } 
    catch(err) { // catch error if request fails
        console.log(err) // log error in console
    }
}

async function markComplete() { // asynchronous function to mark a todo complete (presumably with class 'completed')
    const itemText = this.parentNode.childNodes[1].innerText // extract text inside second child of clicked element's parent (presumably inside span?)

    try { // try request to mark todo 'complete'
        const response = await fetch('markComplete', { // create variable for potential data from put request
            method: 'put', // sets CRUD method for route to put/update list item data
            headers: {'Content-Type': 'application/json'}, // specifies content type (JSON)
            body: JSON.stringify( {'itemFromJS': itemText} ) // declares message content (text from presumably list item span) converted from JSON to string
          })
        const data = await response.json() // create variable for potential result in JSON
        location.reload() // reload page to display updated results
        console.log(data) // log potential result in JSON
    } 
    catch(err) { // catch error if request fails
        console.log(err) // log error in console
    }
}

async function markUnComplete() { // asynchronous function to mark a todo to be completed (presumably by removing class 'completed')
    const itemText = this.parentNode.childNodes[1].innerText // extract text inside second child of clicked element's parent (presumably inside span?)

    try { // try request to mark todo to not 'complete'
        const response = await fetch('markUnComplete', { // create variable for potential data from put request
            method: 'put', // sets CRUD method for route to put/update list item data
            headers: {'Content-Type': 'application/json'}, // specifies content type (JSON)
            body: JSON.stringify( {'itemFromJS': itemText} ) // declares message content (text from presumably list item span) converted from JSON to string
          })
        const data = await response.json() // create variable for potential result in JSON
        location.reload() // reload page to display updated results
        console.log(data) // log potential result in JSON
    } 
    catch(err) { // catch error if request fails
        console.log(err) // log error in console
    }
}