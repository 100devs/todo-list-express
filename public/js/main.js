const deleteBtn = document.querySelectorAll('.fa-trash') // creating item variable that stores everything with class of fa-trash
const item = document.querySelectorAll('.item span') // create item variable that stores all spans with a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') // creating item variable that stores all elements with item class and spans with completed class

Array.from(deleteBtn).forEach((element) => { // create an array of items with delete button and adding an event listener to each
    element.addEventListener('click', deleteItem) // add a click event listener to each item
})

Array.from(item).forEach((element) => { // create an array of items with item and adding an event listener to each
    element.addEventListener('click', markComplete) // add a click event listener to each item
})

Array.from(itemCompleted).forEach((element) => { // create an array of items with item and adding an event listener to each
    element.addEventListener('click', markUnComplete) // add a click event listener to each item
})

async function deleteItem() { // function to delete items  
    const itemText = this.parentNode.childNodes[1].innerText // stores the text but getting trashcan -> trashcan's parent -> span in that parent -> text from that span
    try {
        const response = await fetch('deleteItem', { // make fetch request to deleteItem and store in response variable
            method: 'delete', // method type
            headers: { 'Content-Type': 'application/json' }, // headers
            body: JSON.stringify({ // converts js object or value to JSON string
                'itemFromJS': itemText // item being converted and sent to mark complete route
            })
        })
        const data = await response.json() // gets response from server as json
        console.log(data) // logs data to console
        location.reload() // reload window to re render items. Item clicked will now be marked as complete (class applied via EJS)

    } catch (err) {
        console.log(err) // catch and log any error
    }
}

async function markComplete() { // function to mark complete
    const itemText = this.parentNode.childNodes[1].innerText // gets the 
    try {
        const response = await fetch('markComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ // converts js object or value to JSON string
                'itemFromJS': itemText // item being converted and sent to mark complete route
            })
        })
        const data = await response.json() // gets response from server as json
        console.log(data) // logs data to console
        location.reload() // reload window to re render items. Item clicked will now be marked as complete (class applied via EJS)

    } catch (err) {
        console.log(err) // catch and log any error
    }
}

async function markUnComplete() { // function to mark item as uncomplete
    const itemText = this.parentNode.childNodes[1].innerText // get text from span and put into variable
    try {
        const response = await fetch('markUnComplete', { // fetch request sent to markUnComplete route
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText // item being converted and sent to mark complete route
            })
        })
        const data = await response.json() // gets response from server as json
        console.log(data) // logs data to console
        location.reload() // reload window to re render items. Item clicked will now be marked as complete (class applied via EJS)

    } catch (err) {
        console.log(err) // catch and log any error
    }
}