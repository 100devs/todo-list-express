const deleteBtn = document.querySelectorAll('.fa-trash')
//grab span with class item
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//add event listener to delete button to delete item
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})
//add event listener to span with class item to mark item as complete
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})
//add event listener to item to mark Uncomplete
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

async function deleteItem() {
    //grab item text from item span
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                //send item text to server
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        //refresh the page to trigger get request and show updated list
        location.reload()

    } catch (err) {
        console.log(err)
    }
}

async function markComplete() {
    //grab item text from item span
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
    //grab item text from item span
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