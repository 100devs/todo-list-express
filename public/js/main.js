// Set variable to create "hooks" for specified classes
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Create an array of the entries associated with that const
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // When delete is clicked, delete the item
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) // When mark complete is clicked, strikethrough
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // When mark uncomplete is clicked, strikethrough is removed
})

async function deleteItem(){  // Wait to fire until the deleteItem event listener fires
    const itemText = this.parentNode.childNodes[1].innerText  // 
    try{
        const response = await fetch('deleteItem', {
            method: 'delete', // identifies which server.js CRUD function is called (delete)
            headers: {'Content-Type': 'application/json'}, // please return data in JSON format
            body: JSON.stringify({ // JSON object toString
              'itemFromJS': itemText // return requested item
            })
          })
        const data = await response.json()
        console.log(data) // print fetch response data to console
        location.reload() // reload page

    }catch(err){ // if something goes wrong,
        console.log(err) // print error data to console
    }
}

async function markComplete(){ // Wait to fire until the markComplete event listener fires
    const itemText = this.parentNode.childNodes[1].innerText // print item to DOM
    try{
        const response = await fetch('markComplete', {
            method: 'put', // identifies which server.js CRUD function is called (create)
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

async function markUnComplete(){ // Wait to fire until the markUnComplete event listener fires
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put', // // identifies which server.js CRUD function is called (create)
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