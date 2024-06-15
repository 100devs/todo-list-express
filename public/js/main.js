// Stores a NodeList with all elements with class 'fa-trash' (trash icon) to variable 'deleteBtn'
const deleteBtn = document.querySelectorAll('.fa-trash')
// Stores a NodeList with all elements that are '<span>`s and descendants of 'item' class to variable 'item'
const item = document.querySelectorAll('.item span')
// Stores a NodeList all `<span>` elements that have a class of `completed` within `.item` elements to variable `itemCompleted`
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creates an array from NodeList `deleteBtn` and adds a `click` event listener to each element that executes a callback function `deleteItem`
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Creates an array from NodeList `item` and adds a `click` event listener to each element that executes the callback function `markComplete`
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Creates an array from NodeList `itemCompleted` and adds a `click` event to each element that executes callback function `markUnComplete`
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Defines asyncronous function `deleteItem`
async function deleteItem(){
    // `this` is the current `span` element. Go up to its parent container (<li>) and get 1st childNode (<span>) and retrieve its text
    const itemText = this.parentNode.childNodes[1].innerText
    // Starts a try block to handle any errors that might occur during fetch request
    try{
        // Send a `fetch` to `deleteItem` endpoint and wait for it to completely execute
        const response = await fetch('deleteItem', {
            // Sends a DELETE request
            method: 'delete',
            // Set header to indicate request body contains JSON data
            headers: {'Content-Type': 'application/json'},
            //  Creates an object with property `itemFromJS` and value of `itemText` and convert JavaScript object to a JSON form and include it in the request body
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Parses JSON response from server and assign it to `data` and logs it to console
        const data = await response.json()
        console.log(data)
        // Reloads the page
        location.reload()
    // Catches any errors that occur during `try` block and logs error to console    
    }catch(err){
        console.log(err)
    }
}

// Defines an asyncronous function `markComplete`
async function markComplete(){
    // `this` is the `span` element clicked. Go up to <li> and get 1st child node and retrieve its text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a fetch to relative path `markComplete` and wait for it to execute completed
        const response = await fetch('markComplete', {
            // Send a PUT request
            method: 'put',
            // Set headers to indicate request body contains JSON data
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // Create object `itemFromJS` with value of the text retrieved, `itemText` and convert JavaScript object to JSON format to be included in body request
                'itemFromJS': itemText
            })
          })
        // Awaits response from server, parses it as JSON, and console logs it
        const data = await response.json()
        console.log(data)
        // Refresh the page
        location.reload()
    // Catch any errors that occured in try block and logs error to the console
    }catch(err){
        console.log(err)
    }
}

// Defines asyncronous function `markUnComplete`
async function markUnComplete(){
    // `this` is the current <span> with class of `completed` by click event listener. Go up to <li> parentNode then get the 1st childNode, a <span> and retrieve its text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Make a fetch to relative parth `markUnComplete`
        const response = await fetch('markUnComplete', {
            // Sends a PUT request
            method: 'put',
            // Set headers to specify JSON data being sent
            headers: {'Content-Type': 'application/json'},
            // Create and object with property `itemFromJS` and value of `itemText`. Tranfrom the object to JSON format and send it with the request body
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Awaits response from server and parses as JSON data and console logs it
        const data = await response.json()
        console.log(data)
        location.reload()
    // Catches any errors occurred in try block and console logs it
    }catch(err){
        console.log(err)
    }
}