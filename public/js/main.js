// delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
// items (whatever they are)
const item = document.querySelectorAll('.item span')
// all items that are completed
const itemCompleted = document.querySelectorAll('.item span.completed')

// add an event listener to each delete button
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// for every mark complete thingey add an event listener
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// for every mark uncomplete thingey add an event listener
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// when you click a delete button
async function deleteItem(){
    // find the item to delete on the DOM
    const itemText = this.parentNode.childNodes[1].innerText

    try{
        // send a delete request to the server on /deleteItem
        // normally fetch(url, { settings })
        const response = await fetch('deleteItem', {
            // delete request
            method: 'delete',
            // send as json
            headers: {'Content-Type': 'application/json'},
            // content of our request
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        // console log response data
        console.log(data)
        // reload the page
        location.reload()
    // do something with error
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
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