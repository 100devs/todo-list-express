//// global variables ////
// collect all HTML elements with .fa-trash class, stored in a NodeList
const deleteBtn = document.querySelectorAll('.fa-trash')
// collect all task list items (span elements that are descendants of .item elements), stored in a NodeList
const item = document.querySelectorAll('.item span')
// collect all completed task list items (.completed span elements that are descendants of .item elements), stored in a NodeList
const itemCompleted = document.querySelectorAll('.item span.completed')

//// event listeners ////
// create new array from elements stored in 'deleteBtn' variable; with forEach method, add click event listener to each item
Array.from(deleteBtn).forEach((element)=>{
    // call `deleteItem` on the click event
    element.addEventListener('click', deleteItem)
})

// create new array from elements stored in `item` variable; with forEach method, add click event listener to each item
Array.from(item).forEach((element)=>{
    // call `markComplete` on the click event
    element.addEventListener('click', markComplete)
})

// create new array from elements stored in `itemsCompleted` variable; with forEach method, add click event listner to each item
Array.from(itemCompleted).forEach((element)=>{
    // call `markUnComplete` on the click event
    element.addEventListener('click', markUnComplete)
})

//// functions ////
// remove to do list item, called on 'deleteBtn' event listener (aka, when trash can icon clicked)
async function deleteItem(){
    // store text of clicked trash can in 'itemText'
    // from the clicked '.fa-trash span' get the 1st child node (task item text) of the parent node (<li>) that is clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send DELETE request to server, path for request is 'deleteItem'
        const response = await fetch('deleteItem', {
            // set method of fetch to DELETE
            method: 'delete',
            // set content type to JSON (aka server knows JSON is being sent)
            headers: {'Content-Type': 'application/json'},
            // send object, with body set to a key/value pair (key: 'itemFromJS; value: value of 'itemText')
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // if fetch resolved, convert to JSON
        const data = await response.json()
        // log 'data'
        console.log(data)
        // webpage reload
        location.reload()

    }catch(err){
        // if fetch is rejected, log error(s)
        console.log(err)
    }
}

// style task item as complete (gray + strike through), called on 'item' event listener (aka, a task is clicked)
async function markComplete(){
    // store text of clicked task item in 'itemText'
    // from the clicked '.item' get the 1st child node (task item text) of the parent node (<li>) that is clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send PUT (update) request to server, path for request is 'markComplete'
        const response = await fetch('markComplete', {
            // set method of fetch to PUT
            method: 'put',
            // set content type to JSON (aka server knows JSON is being sent)
            headers: {'Content-Type': 'application/json'},
            // send object, with body set to a key/value pair (key: 'itemFromJS; value: value of 'itemText')
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // if fetch resolved, convert to JSON
        const data = await response.json()
        // log 'data'
        console.log(data)
        // webpage reload
        location.reload()

    }catch(err){
        // if fetch is rejected, log error(s)
        console.log(err)
    }
}

// remove complete task style on a task, called on '.item span.completed' event listener (aka, a completed task is clicked)
async function markUnComplete(){
    // store text of clicked task item in 'itemText'
    // from the clicked '.item span.completed' get the 1st child node (task item text) of the parent node (<li>) that is clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send PUT (update) request to server, path for request is 'markUnComplete'
        const response = await fetch('markUnComplete', {
            // set method of fetch to PUT
            method: 'put',
            // set content type to JSON (aka server knows JSON is being sent)
            headers: {'Content-Type': 'application/json'},
            // send object, with body set to a key/value pair (key: 'itemFromJS; value: value of 'itemText')
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // if fetch resolved, convert to JSON
        const data = await response.json()
        // log 'data'
        console.log(data)
        // webpage reload
        location.reload()

    }catch(err){
        // if fetch is rejected, log error(s)
        console.log(err)
    }
}