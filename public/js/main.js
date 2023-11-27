//create const called 'deleteBtn' to access HTML delete icon. 
const deleteBtn = document.querySelectorAll('.fa-trash')

//create const called 'item' to access HTML span tag with to-do item. 
const item = document.querySelectorAll('.item span')

//create const called 'itemCompleted' to access HTML span tag with completed to-do items. 
const itemCompleted = document.querySelectorAll('.item span.completed')

//Creates an array of all delete buttons and adds click event listeners to each. 
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})

//Creates an array of all to-do items and adds click event listeners to each to mark completed.
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})

//Creates an array of all to-do items and adds click event listeners to each to toggle completion, marking incomplete.
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

//declares function that runs when delete button is clucked, that identifies which item is being targeted, and runs the DELETE method to the database, then reloading the page or reporting errors. 
async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
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

//declares function that runs when item is clicked to mark complete, that identifies which item is being targeted, and runs the PUT method to the database, then reloading the page or reporting errors. 
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

//declares function that runs when item is clicked to mark INcomplete, that identifies which item is being targeted, and runs the PUT method to the database, then reloading the page or reporting errors. 
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