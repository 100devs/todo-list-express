// -------------------------------------------------------------------
// NodeLists are created here from matching DOM elements to manipulate them later.
// This will match all delete buttons...
const deleteBtn = document.querySelectorAll('.fa-trash')
// All span elements within each item...
const item = document.querySelectorAll('.item span')
// And all item spans marked as completed by checking to see if they have the ".completed" css class.
const itemCompleted = document.querySelectorAll('.item span.completed')

// -------------------------------------------------------------------
// Each NodeList is converted to an array, then within a forEach loop, each element has a click event assigned
//  that calls a relevant function.
// Note: This can result in a large amount of duplicate event listeners.
//  It would be better to use "event delegation" here, where we assign one event listener to a parent element,
//  then we access the clicked child elements inside that parent element with event.target.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// -------------------------------------------------------------------
// Function for submitting a delete request to the server.
async function deleteItem(){
    // This is the text of the item whose delete button was clicked.
    // If the order of child elements is ever changed, accessing index 1 will give the wrong element text.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // The deletion request is sent to the server, as a json converted to a string.
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // The server response is converted to json, console logged, then the page is reloaded.
        const data = await response.json()
        console.log(data)
        location.reload()
    }
    // Any errors during the fetch process (including rejected promises) are console logged.
    catch(err){
        console.log(err)
    }
}

// -------------------------------------------------------------------
// Function for marking an item as complete on the server.
async function markComplete(){
    if (this.classList.contains('completed')){
        return
    }
    // This is the text of the item whose mark-complete button was clicked.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // The edit/put request sent to the server so that this item can be marked as complete.
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // This functionality is identical to the delete function above.
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// -------------------------------------------------------------------
// Function for marking an item as incomplete on the server.
async function markUnComplete(){
    // This is the text of the item whose "mark-uncomplete" button was clicked.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // This put/edit request is identical to the markComplete function above, except
        // the request URl is different.
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Again, all of this functionality is identical to the preceding functions above.
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}