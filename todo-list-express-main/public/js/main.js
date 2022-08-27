const deleteBtn = document.querySelectorAll('.fa-trash') // set a variable to hold all of the font awesome trash icons
const item = document.querySelectorAll('.item span') // created variable holding all of the spans in the li with a class of span
const itemCompleted = document.querySelectorAll('.item span.completed') // variable containing any span in the li with the class of item and with the class of completed 

Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem) // Array is made from the const deleteBtn with every item contain fa-trash class. Each element in the array is given the event listener and runs the deleteItem function onClick
})

Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete) // Array is made from each element created with the item variable and given an event listener that runs to makrComplete function onClick
})

Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete) // Array is created from each element created with the itemCompleted variable and runs markunComplete function onClick
})

async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText // variable created to target a child node to edit the innerText
    try {
        const response = await fetch('deleteItem', {
            method: 'delete', // express method to be used in this function
            headers: { 'Content-Type': 'application/json' }, // What type of file to expect back and render it 
            body: JSON.stringify({  // turns the json data that is received into readable information
                'itemFromJS': itemText // used to deliver information from the request body in the server code on each method
            })
        })
        const data = await response.json()
        console.log(data) // console logs data received from from object
        location.reload() // reloads the page once an item is deleated 

    } catch (err) {
        console.log(err) // console logs any error that is thrown 
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
        const data = await response.json() // takes the information that is received from the response fetch and turns it into json
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