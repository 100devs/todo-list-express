const deleteBtn = document.querySelectorAll('.fa-trash') // store all delete buttons
const item = document.querySelectorAll('.item span') // store all items (completed, uncompleted)
const itemCompleted = document.querySelectorAll('.item span.completed') // store all completed items

Array.from(deleteBtn).forEach((element)=>{ // for every delete button
    element.addEventListener('click', deleteItem) // add an event listener that calls deleteItem
})

Array.from(item).forEach((element)=>{ // for each item
    element.addEventListener('click', markComplete) // add and event listener that calls markComplete
})

Array.from(itemCompleted).forEach((element)=>{ // for each completed item
    element.addEventListener('click', markUnComplete) // add an event listener that calls markUncomplete
})

async function deleteItem(){ // asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // get the item on the list that we delete from the DOM (this keyword specifying the item from the deleteBtn array)
    try{
        const response = await fetch('deleteItem', { // fetch from the deleteItem API 
            method: 'delete', // specify we are deleting
            headers: {'Content-Type': 'application/json'}, // specify we are requesting with json
            body: JSON.stringify({ // pass the item we want deleted as JSON
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // await the response in the form of a string in JSON
        console.log(data) // log the string
        location.reload() // reload the page

    }catch(err){
        console.log(err) // if the promise was rejected log the error
    }
}

async function markComplete(){ // asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // get the item we want to mark as complete from the DOM
    try{
        const response = await fetch('markComplete', { // fetch from the markComplete API
            method: 'put', // specify we are updating
            headers: {'Content-Type': 'application/json'}, // specify we are requesting with JSON
            body: JSON.stringify({ // put the item we want to update in the request.body as JSON
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // set data to the response
        console.log(data) // log the data (string)
        location.reload() // reload the page

    }catch(err){
        console.log(err) // if theres an error log it
    }
}

async function markUnComplete(){ // asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // get the item we want to mark as uncomplete from the DOM
    try{
        const response = await fetch('markUnComplete', { // fetch from the markUncomplete API
            method: 'put', // specify that we will be updating
            headers: {'Content-Type': 'application/json'}, // specify we are requesting with JSON
            body: JSON.stringify({ // set the request.body to JSON
                'itemFromJS': itemText // put the item from the DOM into the body
            })
          })
        const data = await response.json() // store the data from the response
        console.log(data) // log the response (string)
        location.reload() // reload the page

    }catch(err){
        console.log(err) // if there was an error, log it
    }
}