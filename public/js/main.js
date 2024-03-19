const deleteBtn = document.querySelectorAll('.fa-trash') //selects all items with .fa-trash class
const item = document.querySelectorAll('.item span')//selects all items with .item span class
const itemCompleted = document.querySelectorAll('.item span.completed')//selects all items with .item span.completed class

Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem) //we are converting a node list 'deleteBtn' into an array, iterate over each element of an arrat and assign an event listener for the 'click' event that triggers a 'deleteItem' function
})

Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete) //we are converting a node list 'item' into an array, iterate over each element of an arrat and assign an event listener for the 'click' event that triggers a 'markComplete' function
})

Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete) //we are converting a node list 'itemCompleted' into an array, iterate over each element of an arrat and assign an event listener for the 'click' event that triggers a 'markUnComplete' function
})

async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText //it's grabbing the thing we clicked on (parentnode = li, childnode = span) and grabbing the text
    try { //try & catch block is used for error-handling
        const response = await fetch('deleteItem', { //we are sending na 'deleteItem' request to 'deleteItem' endpoint
            method: 'delete', //we are specifying that the HTTP method for the request is delete
            headers: { 'Content-Type': 'application/json' }, // we are telling server that the data that is being sent is in json format
            body: JSON.stringify({
                'itemFromJS': itemText// we are converting a javascript object into a json string. we are passing an item to be deleted with the key 'itemFromJS'
            })
        })
        const data = await response.json() //we are reading a response from a servet as json. It waits for the data to be received and parsed before proceding
        console.log(data) //we console.log data to the console
        location.reload() //we are reloading the page

    } catch (err) {
        console.log(err) //if there was an error during the process, we console.log that error
    }
}

async function markComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('markComplete', {
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

async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
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