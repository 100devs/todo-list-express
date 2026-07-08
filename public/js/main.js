// target the class .fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
// target the span elements within the element with the class .item
const item = document.querySelectorAll('.item span')
// target the span with the class .completed within the element with the class .item
const itemCompleted = document.querySelectorAll('.item span.completed')

// for each item in the li that has the trash can icon
Array.from(deleteBtn).forEach((element)=>{
    // attach an event listener for each li item when the trash icon is clicked
    element.addEventListener('click', deleteItem) // invoke deleteItem(): delete item
}) 

// for each item with a class .item
Array.from(item).forEach((element)=>{
    // attach an event listener to mark the item as complete
    element.addEventListener('click', markComplete)
})

// for each li item with a span of a class .completed
Array.from(itemCompleted).forEach((element)=>{
    // attach an event listener to mark the item and uncomplete
    element.addEventListener('click', markUnComplete)
})

// this function will be called when the trash icon is clicked
async function deleteItem(){
    // grab the item the user clicked on to delete
    const itemText = this.parentNode.childNodes[1].innerText
    // error handling, in case the item does not exist
    try{ 
        // initiate the request and wait until a response is received
        const response = await fetch('deleteItem', { // target endpoint
            method: 'delete', // http method delete, remove the item
            // request header, the body of the data is formatted in json
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ // the request body, property set to stringified JSON object
                // create key-value pair
              'itemFromJS': itemText // itemText = the text of the item to be deleted
            }) // end of JSON object
          }) // end of fetch call
        const data = await response.json() // store the response
        console.log(data) // display the response to the console
        location.reload() // refresh the web page

    }catch(err){ // end of try, catch the error
        console.log(err) // display the error in the console
    } // end of catch block
} // end of deleteItem function

// this function will mark the item on the todo list as complete
async function markComplete(){ // declare a function name markComplete
    // grab the item from the list to mark as complete
    const itemText = this.parentNode.childNodes[1].innerText
    try{ // start of the error handling
        // store the response from the request from the markComplete endpoint
        const response = await fetch('markComplete', {
            method: 'put', // http method put, to update the item
            // request header, the body of the data is formatted in json
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ // request body, data converted to json
                'itemFromJS': itemText // key-value pair, itemText = text of the li item
            }) // end of json object
          }) // end of fetch
        const data = await response.json() // store the response to data 
        console.log(data) // display the data in console
        location.reload() // refresh page

    }catch(err){ // catch error, if occured
        console.log(err) // display error in console
    } // end of catch
} // end of markComplete()

// this function changes the item status to incomplete
async function markUnComplete(){ 
    // grabs the text of the item the user clicked on
    const itemText = this.parentNode.childNodes[1].innerText
    try{ // error handling
        // start a fetch request for the endpoint markUnComplete
        const response = await fetch('markUnComplete', { 
            method: 'put', // http method put, updates the status of the item
            // request header, the body of the data is formatted in json
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ // request body, data converted to json
                'itemFromJS': itemText // key-value pair, itemText = text of the li item
            }) // end of json object
          }) // end of fetch request
        const data = await response.json() // store response to json in a data variable
        console.log(data) // display the data in console
        location.reload() // refresh page

    }catch(err){ // handle error, if any
        console.log(err) // display the error in console
    } // end of catch block
} // end of markUnComplete function