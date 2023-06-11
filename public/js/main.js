//- returns a node list of all trash icons
const deleteBtn = document.querySelectorAll('.fa-trash')
//- returns a node list of all the todo items
const item = document.querySelectorAll('.item span')
//- returns a node list of all the iems with a class of completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//- Create an array from the node list and loop through
Array.from(deleteBtn).forEach(e => {
    //- add an event listener that listens on a click and calls the deleteItem function when clicked
    e.addEventListener('click', deleteItem)
})

//- Create an array from the node list and loop through
Array.from(item).forEach(e => {
    //- add an event listener that listens on a click and calls the markComplete function when clicked
    e.addEventListener('click', markComplete)
})

//- Create an array from the node list and loop through
Array.from(itemCompleted).forEach(e => {
    //- add an event listener that listens on a click and calls the markUncomplete function when clicked
    e.addEventListener('click', markUnComplete)
})

//- async function for deleting an item
async function deleteItem() {
    //- it refers to the inner text content of the span that contains the todo item
    const itemText = this.parentNode.childNodes[1].innerText
    //- try catch block
    try {
        //- stores the fetch data in repsonse variable
        const response = await fetch('deleteItem', {
            //- defines the fetch method
            method: 'delete',
            //- relays information about the content being sent to a server
            headers: {'Content-Type': 'application/json'},
            //- stringifies the content being sent so the items can be read
            body: JSON.stringify({
                //- the object being sent
              'itemFromJS': itemText
            })
        })
        //- stores the json fetch response in the data variable
        const data = await response.json()
        //- logs the data to the console
        console.log(data)
        //- reloads the current document
        location.reload()
    //- catch an error
    } catch (err) {
        //- console logs the error
        console.log(err)
    }
}

//- async function for marking an item as complete
async function markComplete() {
    //- it refers to the inner text content of the span that contains the todo item
    const itemText = this.parentNode.childNodes[1].innerText
    //- try catch block
    try {
        //- stores the fetch data in repsonse variable
        const response = await fetch('markComplete', {
            //- defines the fetch method
            method: 'put',
            //- relays information about the content being sent to a server
            headers: {'Content-Type': 'application/json'},
            //- stringifies the content being sent so the items can be read
            body: JSON.stringify({
                //- the object being sent
                'itemFromJS': itemText
            })
        })
        //- stores the json fetch response in the data variable
        const data = await response.json()
        //- logs the data to the console
        console.log(data)
        //- reloads the current document
        location.reload()
    //- catch an error
    } catch (err) {
        //- console logs the error
        console.log(err)
    }
}

//- async function for marking an item as incomplete
async function markUnComplete() {
    //- it refers to the inner text content of the span that contains the todo item
    const itemText = this.parentNode.childNodes[1].innerText
    //- try catch block
    try {
        //- stores the fetch data in repsonse variable
        const response = await fetch('markUnComplete', {
            //- defines the fetch method
            method: 'put',
            //- relays information about the content being sent to a server
            headers: {'Content-Type': 'application/json'},
            //- stringifies the content being sent so the items can be read
            body: JSON.stringify({
                //- the object being sent
                'itemFromJS': itemText
            })
        })
        //- stores the json fetch response in the data variable
        const data = await response.json()
        //- logs the data to the console
        console.log(data)
        //- reloads the current document
        location.reload()
    //- catch an error
    } catch (err) {
        //- console logs the error
        console.log(err)
    }
}