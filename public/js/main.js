const deleteBtn = document.querySelectorAll('.fa-trash') //creates and array of all elements with the fa-trash class
const item = document.querySelectorAll('.item span.incomplete') //creates and array of all elements with the incomplete class
const itemCompleted = document.querySelectorAll('.item span.completed') //creates and array of all elements with the complete class

Array.from(deleteBtn).forEach((element) => { // loops through the array and creates an event listener for each element
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element) => { // loops through the array and creates an event listener for each element
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element) => { // loops through the array and creates an event listener for each element
    element.addEventListener('click', markUnComplete)
})

async function deleteItem() {  //async function called when trash icon clicked
    const itemText = this.parentNode.childNodes[1].innerText //assigns inner text of list item element with the name when trash icon clicked
    try {
        const response = await fetch('deleteItem', { //fetch delete request with /deleteItem url
            method: 'delete',  //delete method specified
            headers: { 'Content-Type': 'application/json' },  // content type specified
            body: JSON.stringify({ //specifies body of request, converts item to json object string
                'itemFromJS': itemText //specifies name of item to be deleted
            })
        })
        const data = await response.json() // stores response from server
        console.log(data)
        location.reload()  //reloads page

    } catch (err) { // catches errors
        console.log(err)
    }
}

async function markComplete() {  //async function called when incomplete items clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('markComplete', {
            method: 'put',                              //PUT method request
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

async function markUnComplete() {//async function called when complete items clicked
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