const deleteBtn = document.querySelectorAll('.fa-trash') // creating variable which selects all elements with class 'fa-trash'
const item = document.querySelectorAll('.item span') //creating variable which selects all spans within parents with class '.item'
const itemCompleted = document.querySelectorAll('.item span.completed') //creating variable which selects all spans with class 'completed' within parents with class 'item'

Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem) //adding event listener 'deleteItem' for every variable 'deleteBtn'
})

Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete) //adding event listener 'markComplete' for every variable 'item'
})

Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete) //adding event listener 'markUnComplete' for every variable 'itemCompleted'
})

async function deleteItem() { //creating async function
    const itemText = this.parentNode.childNodes[1].innerText // create variable that select the text of that element
    try {
        const response = await fetch('deleteItem', { //fetch to server.js with route 'deleteItem' (app.delete('/deleteItem')
            method: 'delete', // the method used
            headers: { 'Content-Type': 'application/json' }, //tells what content type is used
            body: JSON.stringify({ //converts js object to JSON string
                'itemFromJS': itemText // property itemFromJS with value itemText to be sent to server.js
            })
        })
        const data = await response.json() // variable with response
        console.log(data) // console the response
        location.reload() //reload page

    } catch (err) {
        console.log(err) //catch and console error
    }
}

async function markComplete() {
    const itemText = this.parentNode.childNodes[1].innerText // create variable that select the text of that element
    try {
        const response = await fetch('markComplete', { //fetch to server.js with route 'markComplete' (app.put('/markComplete')
            method: 'put', // set method to put
            headers: { 'Content-Type': 'application/json' }, //tells what content type to use
            body: JSON.stringify({ //sends js object as JSON string
                'itemFromJS': itemText // what to send
            })
        })
        const data = await response.json() // variable response
        console.log(data) // logs response 
        location.reload() //reload page

    } catch (err) {
        console.log(err) // catch error
    }
}

async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText // create variable that select the text of that element
    try {
        const response = await fetch('markUnComplete', { //fetch to server.js with route 'markUnComplete' (app.put('/markUnComplete')
            method: 'put', // method is put
            headers: { 'Content-Type': 'application/json' }, //tells what content type to use
            body: JSON.stringify({ //sends js object as JSON string
                'itemFromJS': itemText // what to send
            })
        })
        const data = await response.json() // variable response
        console.log(data) // logs response
        location.reload() //reload page

    } catch (err) {
        console.log(err) // catch error
    }
}