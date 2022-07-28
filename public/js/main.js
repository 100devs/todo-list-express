<<<<<<< HEAD
// declare variable for delete button 
const deleteBtn = document.querySelectorAll('.fa-trash')
// declare varaiable for item
const item = document.querySelectorAll('.item span')
// declare varaiable for completed item
const itemCompleted = document.querySelectorAll('.item span.completed')
// event delegation to add event listeners on all delete buttons
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// event delegation to add event listeners on all items to mark complete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// event delegation to add event listeners on all items to mark uncomplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// creates an async function called deleteItem
async function deleteItem(){
    // delcares variable for the itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // declares variable for the response, and awaits response on deleted item status and returns it as JSON
        // method is delete
=======
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
>>>>>>> 8247adf50f08bd10000a520d0c12dd01ccaa776b
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
<<<<<<< HEAD
          // declares variable for awaited response, console logs it, and reloads page to show item has been deleted
        const data = await response.json()
        console.log(data)
        location.reload()
    // if error, console log error
=======
        const data = await response.json()
        console.log(data)
        location.reload()

>>>>>>> 8247adf50f08bd10000a520d0c12dd01ccaa776b
    }catch(err){
        console.log(err)
    }
}
<<<<<<< HEAD
// creates an async function called markComplete
async function markComplete(){
    // declares variable for the itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // declares variable for the markCompleteresponse, and awaits response on deleted item status and returns it as JSON 
        // method is put - updated
=======

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
>>>>>>> 8247adf50f08bd10000a520d0c12dd01ccaa776b
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
<<<<<<< HEAD
        // declares variable for awaited response, console logs it, and reloads page to show item has been updated
        const data = await response.json()
        console.log(data)
        location.reload()
          // if error, console log error
=======
        const data = await response.json()
        console.log(data)
        location.reload()

>>>>>>> 8247adf50f08bd10000a520d0c12dd01ccaa776b
    }catch(err){
        console.log(err)
    }
}
<<<<<<< HEAD
// creates an async function called markUnComplete
async function markUnComplete(){
    // declares variable for the itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // declares variable for the markCompleteresponse, and awaits response on deleted item status and returns it as JSON 
        // method is put - updated
=======

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
>>>>>>> 8247adf50f08bd10000a520d0c12dd01ccaa776b
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
<<<<<<< HEAD
        // declares variable for awaited response, console logs it, and reloads page to show item has been updated
        const data = await response.json()
        console.log(data)
        location.reload()
// if error, console log error
    }catch(err){
        console.log(err)
    }
}
//
=======
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
>>>>>>> 8247adf50f08bd10000a520d0c12dd01ccaa776b
