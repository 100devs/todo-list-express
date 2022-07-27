const deleteBtn = document.querySelectorAll('.fa-trash')
// selects each li with a class of .item and the spans within it
const item = document.querySelectorAll('.item span')
// selects each li with a class of item and the spans within that have a class "completed"
const itemCompleted = document.querySelectorAll('.item span.completed')

// adds a click event to every rendered elements delete icon
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// adds a click event to every rendered element and will fire markComplete async function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// adds a click event to every element that has a class "completed"
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

/**
 * Name: deleteItem
 * Description: Fires when the delete icon is clicked and will send a DELETE request to our server.
 */
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
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

/**
 * Name: markComplete
 * Description: Fires when an item from our todos is clicked and will make a PUT request to our server.
 */
async function markComplete(){
    // will select the innerText of the first span 
    const itemText = this.parentNode.childNodes[1].innerText

    try{
        // make a PUT request to our server and pass our itemText in the body of our request
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        // convert the response into json
        const data = await response.json()
        console.log(data)

        // represents the current endpoint, reloads our page (which will fire a new GET request)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

/**
 * Name: markUnComplete
 * Description: Fires when an item from our todos is clicked and will make a PUT request to our server.
 */
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