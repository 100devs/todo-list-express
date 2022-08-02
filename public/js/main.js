const deleteBtn = document.querySelectorAll('.fa-trash') // select all items with this icon and turn that into a variable
const item = document.querySelectorAll('.item span') // select all items with this span and turn that into a variable
const itemCompleted = document.querySelectorAll('.item span.completed') // select all items with this apan and turn that into a variable

Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem) // add an event listener for every delete icon
})

Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete) // add an event listener for every complete span icon
})

Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete) // add an event listener for every uncomplete span icon
})

async function deleteItem() { // async function that's gonna do some waiting and then some updating
    const itemText = this.parentNode.childNodes[1].innerText // Grab parent, then child, second one, then text. Pathed reference - might break the DOM. Instead, add classes to your html with the prefix of "js..." so you can easily find it later on
    try {
        const response = await fetch('deleteItem', { // do this
            method: 'delete', // labeling what you're doing
            headers: { 'Content-Type': 'application/json' }, // parse as JSON
            body: JSON.stringify({ // make this a string
                'itemFromJS': itemText // references the app.delete in server.js
            })
        })
        const data = await response.json() // wait for the response, give me json
        console.log(data) // tell me what we got back
        location.reload() // refresh the page

    } catch (err) {
        console.log(err) // oopsie doopsie
    }
}

async function markComplete() { // we're gonna update some stuff
    const itemText = this.parentNode.childNodes[1].innerText // same as on the delete item (line 18)
    try {
        const response = await fetch('markComplete', { // we're gonna wait for things to happen
            method: 'put', // this is what we're gonna do
            headers: { 'Content-Type': 'application/json' }, // send it as JSON
            body: JSON.stringify({ // turn that JSON into a string
                'itemFromJS': itemText // links it to the server.js data
            })
        })
        const data = await response.json() // wait for the response from the server
        console.log(data) // give us that sweet sweet data
        location.reload() // reload the page

    } catch (err) {
        console.log(err) // oopsie daisy
    }
}

async function markUnComplete() { // THIS DOES THE SAME AS ABOVE BUT OPPOSITE
    const itemText = this.parentNode.childNodes[1].innerText // look at line 18
    try {
        const response = await fetch('markUnComplete', { // wait for this to work 
            method: 'put', // you're gonna update this
            headers: { 'Content-Type': 'application/json' }, // make it JSON
            body: JSON.stringify({ // now make it a string
                'itemFromJS': itemText // connect it to the server.js file
            })
        })
        const data = await response.json() // wai tfor the response
        console.log(data) // log that shit
        location.reload() // reload the page

    } catch (err) {
        console.log(err) // danger, will robinson
    }
}