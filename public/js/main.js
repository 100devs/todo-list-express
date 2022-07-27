// go to the DOM and store all the items that has the 'fa-trash' class
// store it to a NodeList
const deleteBtn = document.querySelectorAll('.fa-trash')
// go to the DOM and store all the items that has the 'item span' classes
// store it to a NodeList
const item = document.querySelectorAll('.item p')
// go to the DOM and store all the items that has the 'item span.completed' classes
// store it to a NodeList
const itemCompleted = document.querySelectorAll('.fa-check')

// Create an array from the Nodelist
Array.from(deleteBtn).forEach((element) => {
    // listen for a click event on each item
    element.addEventListener('click', deleteItem)
})

// Create an array from the Nodelist
Array.from(item).forEach((element) => {
    // listen for a click event on each item
    element.addEventListener('click', markComplete)
})

// Create an array from the Nodelist
Array.from(itemCompleted).forEach((element) => {
    // listen for a click event on each item
    element.addEventListener('click', markUnComplete)
})

// deletes the items from the list
async function deleteItem() {
    // trims down the text content to isolate the p element
    const itemText = this.parentNode.children[0].innerText.trim();
    try {
        // sending a DELETE request to the server
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // defining the itemFromJ to itemText
              'itemFromJS': itemText
            })
        })
        // storing the response as json
        const data = await response.json()
        console.log(data)
        // reload the page
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// marks the item complete
async function markComplete() {
        // trims down the text content to isolate the p element
    const itemText = this.parentNode.children[0].innerText.trim();
    try {
        // sending a PUT request to the server
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // store the response as json in data
        const data = await response.json()
        console.log(data)
        // reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete() {
    // trims down the text content to isolate the p element
    const itemText = this.parentNode.children[0].innerText.trim();
    try {
        // sending a PUT request to the server
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // store the response as json in data
        const data = await response.json()
        console.log(data)
        // reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}