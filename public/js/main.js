// Comments by Ashley Christman, Stacey Ali, Omar Hernandez, Mark Fehrenbach, Ryan Hardin, Kimberly Scranton

// Selects all delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
// Selects all spans within a class of 'item'
const item = document.querySelectorAll('.item span')
// Selects all COMPLETED spans within a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')


// Make an array out of all delete buttons, add click event listenener to each that calls back deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Make an array out of all active items, add click event listenener to each that calls back markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Make an array out of all completed items, add click event listenener to each that calls back markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Calls '/deleteItem' route, sends item to be deleted, console logs repsonse, and reloads page
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

// Calls '/markComplete' route, sends item to be marked complete, console logs repsonse, and reloads page
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

// Calls '/markUnComplete' route, sends item to be marked incomplete, console logs repsonse, and reloads page
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