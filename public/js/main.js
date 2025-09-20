//Find the elements with the class "fa-trash" and assign them to the deleteBtn variable
const deleteBtn = document.querySelectorAll('.fa-trash')
//Find the spans that do not have the class "completed" that are descendants of the class "item" and assign them to the deleteBtn variable
const item = document.querySelectorAll('.item span:not(.completed)')
//Find the spans with class "completed" that are descendants of the class "item" and assign them to the itemCompleted variable
const itemCompleted = document.querySelectorAll('.item span.completed')

//Make the node list stored in deleteBtn an array and iterate over the elements of that array, adding an event listener to each that listens for a click and will call the deleteItem function when clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//Make the node list stored in "item" an array and iterate over the elements of that array, adding an event listener to each element that listens for a click and will call the markComplete function when clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//Make the node list stored in itemCompleted an array and iterate over the elements of that array, adding an event listener to each element that listens for a click and will call the markUnComplete function when clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//declare async function deleteItem that is called when a deleteBtn is clicked
async function deleteItem(){
    //Find the text of the item that needs to be deleted and store it in the variable itemText. "This" refers to the specific deleteBtn that was clicked, it looks to the parentNode - the todo list item - and then to the 1st child node of the item and selects the inner text
    const itemText = this.parentNode.childNodes[1].innerText
    //start a try block for the await fetch call
    try{
        // use response to hold the promise for the asynchronous fetch request to the 'deleteItem' route
        const response = await fetch('deleteItem', {
            // tell the server the delete method is being requested
            method: 'delete',
            // tell the server the format of the request body is application/json
            headers: {'Content-Type': 'application/json'},
            // include the body content in the body property. To match what we told the server the format would be, we need to make the content json using JSON.stringify
            body: JSON.stringify({
                // the content we are sending is what we stored in itemText, and we will assign that to an 'itemFromJS' property because that is what the server API is looking for
              'itemFromJS': itemText
            })
          })
        //when the server responds, we want to make sure that response is in json, we will use response.json and await that async function to happen, storing the promise in the variable "data"
        const data = await response.json()
        //once we have the json "data", we will console log that data
        console.log(data)
        //because we have changed the todo list, the document needs to be refreshed using location.reload (location is part of the window object in the browser API)
        location.reload()
    //if any err happens in the try block, it will be passed to the catch block and passed in as a parameter to be handled in the catch block
    }catch(err){
        //console log the error that was passed in to the catch block
        console.log(err)
    }
}

//declare async function markComplete that will run when the todo item is clicked
async function markComplete(){
    //Find the text of the item that needs to be updated as complete and store it in the variable itemText. "This" refers to the specific item that was clicked, it looks to the parentNode - the todo list item - and then to the 1st child node of the item and selects the inner text
    const itemText = this.parentNode.childNodes[1].innerText
    //start a try block for the await fetch call
    try{
        // use response to hold the promise for the asynchronous fetch request to the 'markComplete' route
        const response = await fetch('markComplete', {
            // tell the server the put method is being requested
            method: 'put',
            // tell the server the format of the request body is application/json
            headers: {'Content-Type': 'application/json'},
            // include the body content in the body property. to match what we told the server the format would be, we need to make the content json using JSON.stringify
            body: JSON.stringify({
                // the content we are sending is what we stored in itemText, and we will assign that to an 'itemFromJS' property because that is what the server API is looking for
                'itemFromJS': itemText
            })
          })
        //when the server responds, we want to make sure that response is in json, we will use response.json and await that async function to happen, storing the promise in the variable "data"
        const data = await response.json()
        //once we have the json "data", we will console log that data
        console.log(data)
        //because we have changed the todo list, the document needs to be refreshed using location.reload (location is part of the window object in the browser API)
        location.reload()
    //if any err happens in the try block, it will be passed to the catch block and passed in as a parameter to be handled in the catch block
    }catch(err){
        //console log the error that was passed in to the catch block
        console.log(err)
    }
}

//declare async funtion markUnComplete will run when the todo item is clicked
async function markUnComplete(){
    //Find the text of the item that needs to be updated as complete and store it in the variable itemText. "This" refers to the specific item that was clicked, it looks to the parentNode - the todo list item - and then to the 1st child node of the item and selects the inner text
    const itemText = this.parentNode.childNodes[1].innerText
    //start a try block for the await fetch call
    try{
        // use response to hold the promise for the asynchronous fetch request to the 'markUnComplete' route
        const response = await fetch('markUnComplete', {
            // tell the server the put method is being requested
            method: 'put',
            // tell the server the format of the request body is application/json
            headers: {'Content-Type': 'application/json'},
            // include the body content in the body property. to match what we told the server the format would be, we need to make the content json using JSON.stringify
            body: JSON.stringify({
                // the content we are sending is what we stored in itemText, and we will assign that to an 'itemFromJS' property because that is what the server API is looking for
                'itemFromJS': itemText
            })
          })
        //when the server responds, we want to make sure that response is in json, we will use response.json and await that async function to happen, storing the promise in the variable "data"
        const data = await response.json()
        //once we have the json "data", we will console log that data
        console.log(data)
        //because we have changed the todo list, the document needs to be refreshed using location.reload (location is part of the window object in the browser API)
        location.reload()
    //if any err happens in the try block, it will be passed to the catch block and passed in as a parameter to be handled in the catch block
    }catch(err){
        //console log the error that was passed in to the catch block
        console.log(err)
    }
}