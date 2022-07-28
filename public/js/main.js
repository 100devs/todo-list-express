// Declares unchangeable variable (named 'deleteBtn') of all selectors with the class of ".fa-trash"
const deleteBtn = document.querySelectorAll('.fa-trash')
// Declares unchangeable variable (named 'item') of all selectors with the class names of ".item" and ".span"
const item = document.querySelectorAll('.item span')
// Declares unchangeable variable (named 'itemCompleted') of all selectors with the class names of ".item" and "span.completed"
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creates an array of all selectors from deleteBtn variable and loops through each element whilst waiting for a click event that will delete the item if/when selected.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// Creates an array of all selectors from item variable and loops through each element whilst waiting for a click event that will mark an item complete if/when selected.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// Creates an array of all selectors from itemCompleted variable and loops through each element whilst waiting for a click event that will mark an item not complete if/when selected.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
 
// Creates a function named deleteItem that deletes an item from the task list and MongoDB
async function deleteItem(){
    //
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