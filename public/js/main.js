// targets all of the delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
// targets all of the span tags where the parent has the class of "item"
const item = document.querySelectorAll('.item span')
// targets all span tags with the class of completed where th parent has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array of all of the delete buttons
// to add an event listener of deleteItem to each
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})

// create an array of all of the delete buttons
// to add an event listener of markComplete to each
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})

// create an array of all of the delete buttons
// to add an event listener of mark Uncomplete to each
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

async function deleteItem() {
    // traversesthe DOM up to the parent (li) 
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        // sends a DELETE request to the "deleteItem" endpoint
        const response = await fetch('deleteItem', {
            method: 'delete',
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