const deleteBtn = document.querySelectorAll('.fa-trash') // sets deleteBtn to all Nodes with a class of fa-trash
const item = document.querySelectorAll('.item span') // sets item to span Node inside Nodes with an .item class
const itemCompleted = document.querySelectorAll('.item span.completed') // sets itemCompleted to all span Nodes with a class of 'completed' inside a Node with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // created an array from all deleteBtn Nodes
    element.addEventListener('click', deleteItem) // adds a click event listener to every element in the array, which will activate the deleteItem function
})

Array.from(item).forEach((element)=>{ // creates an array from all 'item' Nodes
    element.addEventListener('click', markComplete) // adds a click event listener to every element in the array, which will activate the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ // creates an array from all 'itemCompleted' Nodes
    element.addEventListener('click', markUnComplete) // adds a click event listener to every element in the array, which will activate the markUncomplete function
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // sets itemText for i = 1. ul is parent, li is [0], span is [1]
    try{
        const response = await fetch('deleteItem', { // sends the request to deleteItem route with the body described below
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText // itemFromJS will send the inner text to the deleteOne method in server.js app.delete
            })
          })
        const data = await response.json() // parses the response as json
        console.log(data) // prints the response
        location.reload() // reloads the location (URL) of the object it is linked to.
    }catch(err){ // if the try block didn't succeed
        console.log(err) // print the error
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // sets itemText for i = 1. ul is parent, li is [0], span is [1]
    try{
        const response = await fetch('markComplete', { // sends the request to the markComplete route
            method: 'put', // calling the same PUT request multiple times will always produce the same result. In contrast, calling a POST request repeatedly have side effects of creating the same resource multiple times.
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText // itemFromJS will send the inner text to the updateOne method in server.js app.put
            })
          })
        const data = await response.json() // response converted to json
        console.log(data) // print the response
        location.reload() // reloads the page (url)

    }catch(err){ // if the above doesn't succeed...
        console.log(err) // print error
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // sets itemText for i = 1. ul is parent, li is [0], span is [1]
    try{
        const response = await fetch('markUnComplete', { // sends the request to the markUnComplete route
            method: 'put', // as an update, not as a creation
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText // itemFromJS will send the inner text to the updateOne method in server.js app.put
            })
          })
        const data = await response.json() // converts response to json
        console.log(data) // prints response
        location.reload() // reloads the page (url)

    }catch(err){ // if the above doesn't work...
        console.log(err) // print the error
    }
}