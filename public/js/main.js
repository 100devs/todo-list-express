const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//When the deleteBtn is clicked it goes to 
//the deleteItem function
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})

//When the item is clicked it goes to 
//the markComplete function
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})

//When the itemCompleted is clicked it goes to 
//the markUnComplete function
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

//deleteItem function
async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        // utilizes the deleteItem function in the server
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

//markComplete function
async function markComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        // utilizes the markComplete function in the server
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

// markUnComplete function
async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        // utilizes the markUnComplete function in the server
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