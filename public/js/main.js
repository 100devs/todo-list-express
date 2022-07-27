// A variable containing a querySelector. It selects every element with the class of .fa-trash.
const deleteBtn = document.querySelectorAll('.fa-trash')
// A variable containing a querySelector. It targets every span nested inside .item class.
const item = document.querySelectorAll('.item span')
// A variable containing a querySelector. It targets spans with .completed class nested inside of .item class.
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creates an array containing elements (.item & span) and adds an eventlistener on each element.
Array.from(deleteBtn).forEach((element)=>{
    // On click, runs deleteItem function 
    element.addEventListener('click', deleteItem)
})

// Creates an array containing elements and adds an eventlistener on each element.
Array.from(item).forEach((element)=>{
    // On click, runs markComplete function 
    element.addEventListener('click', markComplete)
})

// Creates an array containing elements and adds an eventlistener on each element.
Array.from(itemCompleted).forEach((element)=>{
    // On click, runs markUnComplete function 
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    // parentNode represents the .fa class.
    // childNode represents the .fa-trash class.
    const itemText = this.parentNode.childNodes[1].innerText
    // Try is executed first.
    try{
        // await operator waits for a Promise. await is just a fancy way of writing fetch statements without the .then statement. 
        // Fetch method takes in a resource and an object
        const response = await fetch('deleteItem', {
            // The request method 
            method: 'delete',
            // Headers added to request
            headers: {'Content-Type': 'application/json'},
            // A string object added to request
            body: JSON.stringify({
                // Converts a JavaScript object or value to a JSON string
                'itemFromJS': itemText
            })
          })
        // Fetch response stored into variable. Returns a promise which resolves with the result of parsing the body text as JSON.
        const data = await response.json()
        // Prints data.
        console.log(data)
        // 
        location.reload()
    // Handles error.
    }catch(err){
        console.log(err);
    }
}

async function markComplete(){
    // parentNode represents the .item class
    // childNode represents the span elements nested inside .item class
    const itemText = this.parentNode.childNodes[1].innerText
    // Try is executed first.
    try{
        
        const response = await fetch('markComplete', {
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

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
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