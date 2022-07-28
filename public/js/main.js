/*
    set up references to elements on the page that we need to set up listeners for
*/
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

/*
    add event listeners to the elements listed above
*/
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

/*
    request that the server deletes an item from database whenever a delete icon is clicked
*/
async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
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


/*
    request that the server updates an item to be marked as "complete"
*/
async function markComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
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

/*
    request that the server updates an item to be marked as "not complete"
*/
async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
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