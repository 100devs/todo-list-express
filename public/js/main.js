const deleteBtn = document.querySelectorAll('.fa-trash')
//select the trashcan, storing it in a variable
const item = document.querySelectorAll('.item span')
//select the span elements are children of .item, storing it in a variable
const itemCompleted = document.querySelectorAll('.item span.completed')
//select the span.completed elements are children of .item, storing it in a variable

Array.from(deleteBtn).forEach((element) => {
    //add event listener to each element in the deleteBtn Array(trashcans)
    element.addEventListener('click', deleteItem)
    //add the click event, invoke deleteItem
})

Array.from(item).forEach((element) => {
    //add event listener to each element in the item Array
    element.addEventListener('click', markComplete)
    //add the click event, invoke markComplete
})

Array.from(itemCompleted).forEach((element) => {
    //add event listener to each element in the itemCompleted Array
    element.addEventListener('click', markUnComplete)
    //add the click event, invoke markUnComplete
})

async function deleteItem() {
    //declaring async function 
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('deleteItem', {
            //fetch changes the URL path to '/deleteItem
            //the second parameter is an object specifying the details of the request
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        //the 'Todo Deleted' object is stored in a variable called data
        console.log(data)
        //console.log the data
        location.reload()
        //refreshes the page to '/'

    } catch (err) {
        console.log(err)
    }
    //error handling
}

async function markComplete() {
    //declares an UPDATE function
    const itemText = this.parentNode.childNodes[1].innerText
    //??? This might be the 'completed' ?
    try {
        const response = await fetch('markComplete', {
            //the fetch requests a URL path that calls a function that lives in the server.js
            //specifies the info about the request
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        //wait for the json to come back, store it in variable data
        console.log(data)
        //console.log it
        location.reload()
        //refresh the page back to '/'

    } catch (err) {
        console.log(err)
        //error handling
    }
}

async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    //grab the item text
    try {
        const response = await fetch('markUnComplete', {
            //changes our path to '/markUnComplete'
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            //CONTENT-TYPE determines what language to expect
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        //wait for the data, put it in a variable
        console.log(data)
        //log it
        location.reload()
        //refresh '/'

    } catch (err) {
        console.log(err)
    }
    //error handling
}