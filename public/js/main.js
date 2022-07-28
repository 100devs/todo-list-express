// Set a constant to target the trash can icon selectors
const deleteBtn = document.querySelectorAll('.fa-trash')
// Set a constant to target the span within the list items
const item = document.querySelectorAll('.item span')
// Set a constant to target the completed list items
const itemCompleted = document.querySelectorAll('.item span.completed')

// Convert 'deleteBtn' to an array, then call 'forEach' on the array
Array.from(deleteBtn).forEach((element)=>{
    // Add an event listener so that each time the trash can icon is clicked, run the deleteItem function on the related list item
    element.addEventListener('click', deleteItem)
})

// Convert 'item' to an array, then call 'forEach' on the array
Array.from(item).forEach((element)=>{
    // Add an event listener so that each time an item is clicked, run the markComplete function on the related list item
    element.addEventListener('click', markComplete)
})

// Convert 'itemCompleted' to an array, then call 'forEach' on the array
Array.from(itemCompleted).forEach((element)=>{
    // Add an event listener so that each time a completed item is clicked, run the markUnComplete function on the related list item
    element.addEventListener('click', markUnComplete)
})

// Declare the deleteItem function and allow it to run asynchronously
async function deleteItem(){
    // From the <span> bound by the event listener, get the 1th childNode (<span>) from the parentNode (<li>), and get the text content
    const itemText = this.parentNode.childNodes[1].innerText
    
    try{
        // Fetch 'deleteItem'
        const response = await fetch('deleteItem', {
            // Set request method to DELETE
            method: 'delete',
            // Set the header content type to JSON, so it can properly parse our JSON data
            headers: {'Content-Type': 'application/json'},
            // Send the object as a JSON string with a property of itemFromJS and value of 'itemText
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Parse the response as JSON, assign it to a constant 'data'
        const data = await response.json()
        // Console log the data to check if it worked
        console.log(data)
        // Reload the webpage
        location.reload()
    
    // If there are any errors, console log them
    }catch(err){
        console.log(err)
    }
}

// Declare the markComplete function and allow it to run asychronously
async function markComplete(){
    // From the <span> bound by the event listener, get the 1th childNode from the parentNode, and get the text content
    const itemText = this.parentNode.childNodes[1].innerText

    try{
        // Fetch 'markComplete'
        const response = await fetch('markComplete', {
            // Set request method to PUT
            method: 'put',
            // Set the content header type to JSON, so it can properly parse our JSON data
            headers: {'Content-Type': 'application/json'},
            // Send the object as a JSON string with a property of itemFromJS and value of 'itemText'
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Parse the response as JSON, assign it to a constant 'data'
        const data = await response.json()
        // Console log the data to check if it worked
        console.log(data)
        // Reload webpage
        location.reload()

    // If there are any errors, console log them      
    }catch(err){
        console.log(err)
    }
}

// Declare the markUnComplete function and allow it to run asynchronously
async function markUnComplete(){
    // From the <span> bound by the event listener, get the 1th childNode from the parentNode, and get the text content
    const itemText = this.parentNode.childNodes[1].innerText
    
    try{
        // Fetch 'markUnComplete'
        const response = await fetch('markUnComplete', {
            // Set request method to PUT
            method: 'put',
            // Set the content header type to JSON, so it can properly parse our JSON data
            headers: {'Content-Type': 'application/json'},
            // Send the object as a JSON string with a property of itemJS and value of 'itemText' 
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Parse the response as JSON and assign it to a constant 'data'
        const data = await response.json()
        // Console log the data to see if it worked
        console.log(data)
        // Reload webpage
        location.reload()

    // If there are any errors, console log them    
    }catch(err){
        console.log(err)
    }
}