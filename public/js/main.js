// Create variable with query selecotr from item with class .fa-trash and store all in an array
const deleteBtn = document.querySelectorAll('.fa-trash')

// Create variable with query selector from item with class .item and child span and store all in an array
const item = document.querySelectorAll('.item span')

// Create variable with query selector from item with class .item and child span.completed and store all in an array
const itemCompleted = document.querySelectorAll('.item span.completed')

// Iterate through array and add event listener on click which will call deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Iterate through array and add event listener on click which will call markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Iterate through array and add event listener on click which will call markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


async function deleteItem(){
    // create variable and assign the span inner text form the first span of click span siblings
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send a delete request to api server
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            // Send (in the request body) include the inner text from above as an object with the key itemFormJs
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })

        // Assign the response to a variable called data
        const data = await response.json()
        console.log(data)

        // Refresh page sending get request to server
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    // Declare variable and set contents to things value so we can search the db for this item
    const itemText = this.parentNode.childNodes[1].innerText

    // Send a put request to backend api
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // Send item contents with the variable name itemFromJS
                'itemFromJS': itemText
            })
          })
        // Set response equal to variable named data
        const data = await response.json()
        console.log(data)

        // Refresh the page sending another get request
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Same as markComplete function above
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