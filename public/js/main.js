
// Assigns a NodeList of all HTMLElements with a class of `fa-trash` 
// to the const variable `deleteBtn`
const deleteBtn = document.querySelectorAll('.fa-trash')
// Assigns a NodeList of all HTMLElements that are <span>s and children of 
// elements with a class of `item` to the const variable `item`
const item = document.querySelectorAll('.item span')
// Assign a NodeList of all HTMLElements that are <span>s with a class of `completed` 
// and children of elements with a class of `item` to the const variable `itemCompleted`
const itemCompleted = document.querySelectorAll('.item span.completed')


// Convert `deleteBtn` to an array of HTMLElements, then call `forEach` on it
Array.from(deleteBtn).forEach((element)=>{
    // Adds a click event listener (smurf) to each element, calling the `deleteItem` func
    element.addEventListener('click', deleteItem)
})

// Convert `item` to an array of HTMLElements, then call `forEach` on it
Array.from(item).forEach((element)=>{
    // Adds an click event listener to each element, calling the `markComplete` function
    element.addEventListener('click', markComplete)
})

// Convert `itemCompleted` to an array of HTMLElements, then call `forEach` on it
Array.from(itemCompleted).forEach((element)=>{
    // Add an click event listener to each element, calling the `markUnComplete` function
    element.addEventListener('click', markUnComplete)
})

// ASYNC FUNCTIONS 
// function to delete elems
async function deleteItem(){
    // From the current <span> (bound to this by the event listener), get the parentNode - 
    // the <li> - then get the 1th childNode - the <span>, then retrieve the text content of it 
    // by reading the `innerText` property
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Make a fetch to the relative path `deleteItem`
        const response = await fetch('deleteItem', {
            // Set method of request to DELETE
            method: 'delete',
            // Set header `Content-Type` to `application/json` so it knows to expect and parse JSON
            headers: {'Content-Type': 'application/json'},
            // Send the obj with a property of itemFromJS and value of the `itemText` of the current item as a JSON string
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Try to load and parse the response body as JSON, assigning it to data
        const data = await response.json()
        console.log(data)
        // reloads page
        location.reload()

    }catch(err){
        // log errors, if any
        console.log(err)
    }
}
// function to mark items as complete
async function markComplete(){
    // Make a fetch to the relative path `markComplete`
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            // Set method of the request to PUT, otherwise same as deleteItem()
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        // logs errors, if any
        console.log(err)
    }
}

// function to mark items as unComplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Make a fetch to the relative path `markUnComplete`
        // otherwise, same as markComplete()
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        // logs errors, if any
        console.log(err)
    }
}