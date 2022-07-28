/* 
-create variable to identify the delete button with the .fa-trash(class)
-create variable to identify .item(class) and span(element)
-create variable to identify .item(class) and span element with a .completed(class)
-querySelectorAll always returns a node list
*/
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')


/*
Set as the variables item, itemCompleted, and deleteBtn, grabs all the elements from the document specified from those respective variables
and translates them into one array, where we loop through each element of the array with the forEach here.
Inside the loop, we add the click event, where we establish which function to call on when that respective element is clicked
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
    asynchronous function to make a fetch request to the server to delete one item
    store the text from the specified delete button (the todo item)
    performs the fetch request in a try catch blog, logging any errors to the 
    user console
    awaits a fetch request for the 'deleteItem' endpoint with:
        method: delete
        headers: application.json formated content-type
        body: the stringified version of the object that has the key: itemFromJS
        and stores the value of the todo item from the HTML element
    awaits the response and stores it as json (which is a confirmation message from the server)
    logs the response and reloads the page
*/
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

/*
parentNode will return a HTML collection and chilNode will return a NodeList
This is going to try and fetch the data from the method, headers, and body and then try and catch and see if there is any errors.
Fetching the markComplete endpoint from the server.
The JSON.stringify will convert a javascript object or value into a JSON string
*/

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
/*
parentNode will return a HTML collection and chilNode will return a NodeList
This is going to try and fetch the data from the method, headers, and body and then try and catch and see if there is any errors.
Fetching the markUnComplete endpoint from the server.
The JSON.stringify will convert a javascript object or value into a JSON string
*/
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