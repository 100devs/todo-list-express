// Selects all delete buttons on the page
const deleteBtn = document.querySelectorAll('.fa-trash')

// Selects all to-do items
const item = document.querySelectorAll('.item span')

// Selects all completed to-do items
const itemCompleted = document.querySelectorAll('.item span.completed')

// Adds a click event to each delete button
// When clicked, it runs the deleteItem function
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})

// Adds a click event to each incomplete to-do item
// When clicked, it runs the markComplete function
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})

// Adds a click event to each completed to-do item
// When clicked, it runs the markUnComplete function
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

// Deletes a to-do item
async function deleteItem() {
    // Gets the text of the selected to-do item
    const itemText = this.parentNode.childNodes[1].innerText

    try {
        // Sends a DELETE request to the server
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })

        // Converts the server response to JSON
        const data = await response.json()

        // Displays the response in the console
        console.log(data)

        // Reloads the page so the deleted item disappears
        location.reload()

    } catch (err) {
        // Logs any errors to the console
        console.log(err)
    }
}

// Marks a to-do item as complete
async function markComplete() {
    // Gets the text of the selected to-do item
    const itemText = this.parentNode.childNodes[1].innerText

    try {
        // Sends a PUT request to the server to mark the item complete
        const response = await fetch('markComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })

        // Converts the server response to JSON
        const data = await response.json()

        // Displays the response in the console
        console.log(data)

        // Reloads the page to show the item as completed
        location.reload()

    } catch (err) {
        // Logs any errors to the console
        console.log(err)
    }
}

// Marks a completed to-do item as incomplete
async function markUnComplete() {
    // Gets the text of the selected completed item
    const itemText = this.parentNode.childNodes[1].innerText

    try {
        // Sends a PUT request to the server to mark the item as incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })

        // Converts the server response to JSON
        const data = await response.json()

        // Displays the response in the console
        console.log(data)

        // Reloads the page to show the item as incomplete
        location.reload()

    } catch (err) {
        // Logs any errors to the console
        console.log(err)
    }
}