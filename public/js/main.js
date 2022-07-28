// collect a node list containing all the the html elements with the class fa-trash
// & assign node list value to deleteBtn constant
const deleteBtn = document.querySelectorAll('.fa-trash')
// collect a node list containing all of the descendent span elements whose parent has the class of item
// & assign node list value to item constant
const item = document.querySelectorAll('.item span')
// collect a node list containing all of the descendent span elements with the class of comnpleted
// whose parent has the class of item
// & assign node list value to itemCompleted constant
const itemCompleted = document.querySelectorAll('.item span.completed')

// convert the deleteBtn node list to an array
Array.from(deleteBtn).forEach((element)=>{
    // for each element (node) in the array, add a click event listener that calls the deleteItem function
    // when that element (node) is clicked on
    element.addEventListener('click', deleteItem)
})
// convert the item node list to an array
Array.from(item).forEach((element)=>{
    // for each element (node), add a click event listener that calls the markComplete function
    // when that element (node) is clicked on
    element.addEventListener('click', markComplete)
})
// convert the itemCompleted node list to an array
Array.from(itemCompleted).forEach((element)=>{
    // for each element (node), add a click event listener that calls the markUnComplete function
    // when that element (node) is clicked on
    element.addEventListener('click', markUnComplete)
})
// declare async function deleteItem which gets called when a click event is triggered
async function deleteItem(){
    // the target of the click event is referred to by this
    // access the parent nodes child at index 1, take the innerText value and assign it to itemText const
    const itemText = this.parentNode.childNodes[1].innerText
    // execute try block
    try{
        // await the value of a resolved promise from making an async fetch call to route 'deleteItem'
        const response = await fetch('deleteItem', {
            // http delete request
            method: 'delete',
            // the content will be in json format
            headers: {'Content-Type': 'application/json'},
            // attach stringified data to the fetch request body to be accessed in the backend
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // await the value of a resolved promise from the async json() call,
        // converting json response data (from the backend) to JavaScript
        const data = await response.json()
        // console log that data now in JS
        console.log(data)
        // with the successful response received, reload browser to reflect up to date data
        location.reload()
    // if an exception is thrown, execute catch block
    }catch(err){
        // console log the error that caused the exception
        console.log(err)
    }
}
// declare async function markComplete, executes when click event triggers it
async function markComplete(){
    // the target of the click even is referred to by this
    // access the parent nodes child at index 1, take the innerText value and assign it to itemText const
    const itemText = this.parentNode.childNodes[1].innerText
    // execute try block
    try{
        // await the value of a resolved promise from making an async fetch call to route 'markComplete'
        const response = await fetch('markComplete', {
            // http put request (update)
            method: 'put',
            // the content will be in json format
            headers: {'Content-Type': 'application/json'},
            // attach stringified data to the fetch request body to be accessed in the backend
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // await the value of a resolved promise from the async json() call,
        // converting json response data from the backend to JS
        const data = await response.json()
        // console log the JS data
        console.log(data)
        // with successful response, reload browser to reflect changes
        location.reload()
    // if an exception is thrown, execute catch block
    }catch(err){
        // console log the error that caused the exception
        console.log(err)
    }
}
// declare async function markUnComplete to execute when triggered by a click event
async function markUnComplete(){
    // the target of the click even is referred to by this
    // access the parent nodes child at index 1, assign its innerText value to itemText const
    const itemText = this.parentNode.childNodes[1].innerText
    // execute try block
    try{
        // await the value of a resolved promise from making an async fetch call to route 'markUnComplete'
        const response = await fetch('markUnComplete', {
            // http put request
            method: 'put',
            // content will be in json format
            headers: {'Content-Type': 'application/json'},
            // stringify JS into json, attach to req body to be accessed in the backend
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // await the value of a resolved promise from the async json() call,
        // converting json response data from the backend into JS
        const data = await response.json()
        // console log the data that is now in JS
        console.log(data)
        // with successful response, reload browser to reflect changes
        location.reload()
    // if an exception is thrown, execute catch block
    }catch(err){
        // console log the error that caused the exception
        console.log(err)
    }
}