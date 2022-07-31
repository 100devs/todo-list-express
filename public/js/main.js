// Assign NodeList variable from any and all items with class fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
// Assign NodeList variable from anything within class item that has a span
const item = document.querySelectorAll('.item span')
// Assign NodeList variable from items inside item class that are of a span with the completed class
const itemCompleted = document.querySelectorAll('.item span.completed')

// Create true array from NodeList of deleteBtn nodes and add a click event listener that triggers the function deleteItem
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Create true array of NodeList of incomplete items and add click events for markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Create completed items array from itemCompleted NodeList; event listeners all round for markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// deleteItem function will remove the selected document
async function deleteItem(){
    // Assign variable to clicked on item's parent node, and then the contents of its very first child node's text bit, and then actual string therein
    const itemText = this.parentNode.childNodes[1].innerText
    // try (method to catch errors)
    try{
        // assign variable to HTTP request, and wait for the fetch to hit the deleteItem route
        const response = await fetch('deleteItem', {
            // Method is DELETE
            method: 'delete',
            // Header tells us the body will be a JSON
            headers: {'Content-Type': 'application/json'},
            // The body will be made into a string from a JSON
            body: JSON.stringify({
                // Grab itemText from text content of li span selected and send 
              'itemFromJS': itemText
            })
          })
          // Data will be created from the response we wait for
        const data = await response.json()
        // Now that it's a JSON, console.log for verification
        console.log(data)
        // Reload where we are to refresh page with new info
        location.reload()
    // Done with try clause, now deal with any errors
    }catch(err){
        // By logging the error err
        console.log(err)
    }
}

// markComplete function will change property of something with completed value of false
async function markComplete(){
    // Create a variable of the content of the selected node's text
    const itemText = this.parentNode.childNodes[1].innerText
    // Start the try clause
    try{
        // create variable and wait for the server.js route markComplete to finish its work
        const response = await fetch('markComplete', {
            // Update via PUT method
            method: 'put',
            // Content will be JSON
            headers: {'Content-Type': 'application/json'},
            // Create the JSON string
            body: JSON.stringify({
                // send the contents of itemText as itemFromJS
                'itemFromJS': itemText
            })
          })
          // Wait for the response and turn it into JSON
        const data = await response.json()
        // Log the data JSON
        console.log(data)
        // Refresh the page
        location.reload()
    // Catch an error by its tail
    }catch(err){
        // And log that error
        console.log(err)
    }
}

// This function will take an item with class complete and remove that category by changing the completed property to false
async function markUnComplete(){
    // Create your itemText by grabbing the text of the current element
    const itemText = this.parentNode.childNodes[1].innerText
    // Open the try 
    try{
        // Our response is going to wait for a fetch to the markUnComplete route
        const response = await fetch('markUnComplete', {
            // Via the PUT update method
            method: 'put',
            // Let it know it's a JSON
            headers: {'Content-Type': 'application/json'},
            // And make the content a JSON string
            body: JSON.stringify({
                // Let's call the value itemText with the property name itemFromJS
                'itemFromJS': itemText
            })
          })
          // wait for the response and make it into JSON
        const data = await response.json()
        // log the response 
        console.log(data)
        // refresh the page
        location.reload()
    // grab the error
    }catch(err){
        // and log it
        console.log(err)
    }
}