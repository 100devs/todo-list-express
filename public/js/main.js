// Assign a NodeList of all HTMLElements with a class of `fa-trash` to the constant variable `deleteBtn`
const deleteBtn = document.querySelectorAll('.fa-trash')
// Assign a NodeList of all HTMLElements that are <span>s and descendants of elements with a class of `item` to the constant variable `item`
const item = document.querySelectorAll('.item span')
// Assign a NodeList of all HTMLElements that are <span>s with a class of `completed` and descendants of elements with a class of `item` to the constant variable `itemCompleted`
const itemCompleted = document.querySelectorAll('.item span.completed')

// Convert `deleteBtn` to an array of HTMLElements, then call `forEach` on it
Array.from(deleteBtn).forEach((element)=>{
    // Add an click event listener to each element, calling `deleteItem`
    element.addEventListener('click', deleteItem)
})

// Convert `item` to an array of HTMLElements, then call `forEach` on it
Array.from(item).forEach((element)=>{
    // Add an click event listener to each element, calling `markComplete`
    element.addEventListener('click', markComplete)
})

// Convert `itemCompleted` to an array of HTMLElements, then call `forEach` on it
Array.from(itemCompleted).forEach((element)=>{
    // Add an click event listener to each element, calling `markUnComplete`
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    // From the current <span> (bound to this by the event listener), get the parentNode - the <li> - then get the 1th childNode - the <span>, then retrieve the text content of it by reading the `innerText` property
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Make a fetch to the relative path `deleteItem`
        const response = await fetch('deleteItem', {
            // Set method of request to DELETE
            method: 'delete',
            // Set header `Content-Type` to `application/json` so it knows we're sending JSON, and how to parse our data
            headers: {'Content-Type': 'application/json'},
            // Send the object with a property of itemFromJS and value of the `itemText` of the current item as a JSON string
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Attempt to load and parse the response body as JSON, assigning it to data
        const data = await response.json()
        console.log(data)
        // Reload the webpage
        location.reload()

    }catch(err){
        // If there are any errors, console.log them
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Make a fetch to the relative path `markComplete`
        const response = await fetch('markComplete', {
            // Set method of request to PUT
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
        // If any errors are caught, console.log them
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Make a fetch to the relative path `markUnComplete`
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
        console.log(err)
    }
}