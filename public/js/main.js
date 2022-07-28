
// places all of the elements with a class of fa-trash into an array from the dom
const deleteBtn = document.querySelectorAll('.fa-trash')

// places all of the span elements that that are nested into an element that has a class of item into an array from the dom
const item = document.querySelectorAll('.item span')

// places all of the span elements that have a class of completed and are nested into an element with a class of item into an array from the dom
const itemCompleted = document.querySelectorAll('.item span.completed')

// adds event listeners to all elements within the deleteBtn array
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// adds event listeners to all elements within the item array
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// adds event listeners to all elements within the itemCompleted array
Array.from(itemCompleted).forEach((element)=> {
    element.addEventListener('click', markUnComplete)
})


// creates a request to the server to delete an item from the to do list
async function deleteItem(){
    // retrieves the item name that was associated with the trash can icon clicked on
    const itemText = this.parentNode.childNodes[1].innerText

    // creates a fetch which makes a delete request to the server to delete an item from the database
    try{
        // makes a delete request and places the value returned from the promise into response variable
        const response = await fetch('deleteItem', {
            // specifies request as a delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            // places to list item name into the body of the request that will be sent to the server
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // parses json information returned from server into a javascript object
        const data = await response.json()
        // prints data object information inside console
        console.log(data)
        // reloads current page
        location.reload()

    // if an error occurs with request, catch method is called and places error information into callback function provided as an argument
    }catch(err){
        // prints error information inside console
        console.log(err)
    }
}
// sends a put request for updating a list item to be set to completed
async function markComplete(){
    // retrieves name of list item to be updated and stores it in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends a put request to server
        const response = await fetch('markComplete', {
            // sets of type of request to be made to server
            method: 'put',
            // sets the information type being sent to json
            headers: {'Content-Type': 'application/json'},
            // converts the item name information into json and stores it into the body of the request being sent to server
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // converts information retrieved from server into a javascript object and stores it in the data variable
        const data = await response.json()
        console.log(data)
        // reloads the current page
        location.reload()

    // runs if any error occurs while making fetch request
    }catch(err){
        console.log(err)
    }
}

// sends a put request for updating a list item to be set to uncompleted
async function markUnComplete(){
    // retrieves name of list item to be updated and stores it in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends a put request to server
        const response = await fetch('markUnComplete', {
            // sets of type of request to be made to server
            method: 'put',
            // sets the information type being sent to json
            headers: {'Content-Type': 'application/json'},
            // converts the item name information into json and stores it into the body of the request being sent to server
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // converts information retrieved from server into a javascript object and stores it in the data variable
        const data = await response.json()
        console.log(data)
        // reloads current page
        location.reload()

    }catch(err){
        console.log(err)
    }
}