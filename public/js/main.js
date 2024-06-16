const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of ALL elements with class of fa-trash
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of ALL span tags inside of a parent that has class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans with a class of completed inside of parent with class of item

Array.from(deleteBtn).forEach((element) => { // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // add an event listener that waits for 'click' and once we hit click, it calls a function named deleteItem
}) // close the loop

Array.from(item).forEach((element) => { // creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener that waits for 'click' and once we hit click, it calls a function named markComplete
}) // close the loop    

Array.from(itemCompleted).forEach((element) => { // creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to ONLY completed items
}) //closing the loop

async function deleteItem() { // declaring an asynchronous function
    const itemText = this.parentNode.children[1].innerText // looks inside of list item and grabs ONLY the inner text within the list span.
    try { // starting a  try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the deleteItem route
            method: 'delete', // sets the CRUD method for the route
            headers: { 'Content-Type': 'application/json' }, //specifying the type of content expected , here it's json
            body: JSON.stringify({ //declare the message content being passed and stringify the content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
        }) //closing the response object which has fetch
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    } catch (err) { // if an error occurs, pass the error into the catch block
        console.log(err) // log the error into the console
    } //closing the catch block
} // closing the deleteItem function

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