const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // event listener to delete
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) // event listener to mark complete
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // event listener to mark uncomplete
})

async function deleteItem(){ // delete function
    const itemText = this.parentNode.childNodes[1].innerText // list items
    try{
        const response = await fetch('deleteItem', { // fetch to delete
            method: 'delete', // delete part of crud
            headers: {'Content-Type': 'application/json'}, // array object
            body: JSON.stringify({ // change the doc to a string
              'itemFromJS': itemText // what is being deleted
            })
          })
        const data = await response.json() // await the response from server
        console.log(data) // console log
        location.reload() // reload window

    }catch(err){
        console.log(err) // catch errors
    }
}

async function markComplete(){ // update function
    const itemText = this.parentNode.childNodes[1].innerText // list items
    try{
        const response = await fetch('markComplete', { // fetch to update
            method: 'put', // update method of crud
            headers: {'Content-Type': 'application/json'}, // array object
            body: JSON.stringify({ // change the doc to a string
              'itemFromJS': itemText // what is being deleted
            })
          })
        const data = await response.json() // await the response from server
        console.log(data) // console log
        location.reload() // reload window

    }catch(err){
        console.log(err) // catch errors
    }
}

async function markUnComplete(){ // update function
    const itemText = this.parentNode.childNodes[1].innerText // list items
    try{
        const response = await fetch('markUnComplete', { // fetch to update
            method: 'put', // update method of crud
            headers: {'Content-Type': 'application/json'}, // array object
            body: JSON.stringify({ // change the doc to a string
              'itemFromJS': itemText // what is being deleted
            })
          })
        const data = await response.json() // await the response from server
        console.log(data) // console log
        location.reload() // reload window

    }catch(err){
        console.log(err) // catch errors
    }
}