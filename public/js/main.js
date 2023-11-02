// select all the HTMLElement with a class named "fa-trash", and assign this Nodelist to a constant variable "deleteBtn"
const deleteBtn = document.querySelectorAll('.fa-trash')

// select all the HTMLElement that are are <span>s and descendants of elements with a class named "item", and assign this Nodelist to a constant variable "item"
const item = document.querySelectorAll('.item span')

// select all the HTMLElement that are are <span>s with a class named "completed" and descendants of elements with a class named "item", and assign this Nodelist to a constant variable "itemCompleted"
const itemCompleted = document.querySelectorAll('.item span.completed')

// Convert `deleteBtn` to an array of HTMLElements, then on each other the item add an event, which is click event; when event is triggerred, function called deleteItem will be run.
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})

// Convert `item` to an array of HTMLElements, then on each other the item add an event, which is click event; when event is triggerred, function called markComplete will be run.
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})

// Convert `itemCompleted` to an array of HTMLElements, then on each other the item add an event, which is click event; when event is triggerred, function called markComplete will be run.
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

//Declare an async function called deleteItem
async function deleteItem() {
    // From the current <span> (bound to this by the event listener), get the parentNode - the <li> - then get the 1th childNode - the <span>, then retrieve the text content of it by reading the `innerText` property
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        // Make a fetch to the relative path `deleteItem`
        const response = await fetch('deleteItem', {
            // Set method of request to DELETE
            method: 'delete',
            // Set header `Content-Type` to `application/json` so it knows we're sending JSON, and how to parse our data
            headers: { 'Content-Type': 'application/json' },
            // Send the object with a property of itemFromJS and value of the `itemText` of the current item as a JSON string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // Attempt to load and parse the response body as JSON, assigning the response to data
        const data = await response.json()
        // Reload the webpage once response is received
        console.log(data)
        location.reload()
        // If there are any errors, console.log them
    } catch (err) {
        console.log(err)
    }
}

async function markComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        // Make a fetch to the relative path `markComplete`
        const response = await fetch('markComplete', {
            // Set method of request to PUT

            method: 'put',
            // Set header `Content-Type` to `application/json` so it knows we're sending JSON, and how to parse our data
            headers: { 'Content-Type': 'application/json' },
            // Send the object with a property of itemFromJS and value of the `itemText` of the current item as a JSON string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // parse the response as JSON, and store it into a constant variable called data
        const data = await response.json()
        console.log(data)
        // reload the page when response is received
        location.reload()

    } catch (err) {
        // if there are any errors caught, they will be logged on console
        console.log(err)
    }
}

async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        // Make a fetch to the relative path `markUnComplete`
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.log(err)
    }
}