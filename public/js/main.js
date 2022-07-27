const deleteBtn = document.querySelectorAll('.fa-trash') // store all elements in the dom with a class of fa-trash in deleteBtn
const item = document.querySelectorAll('.item span') // store all span text from item classes in item variable
const itemCompleted = document.querySelectorAll('.item span.completed') // store completed items 

Array.from(deleteBtn).forEach((element)=>{ // event listener on all the fa-trash icons stored in deleteBtn
    element.addEventListener('click', deleteItem) // on click, call back deleteItem function
})

Array.from(item).forEach((element)=>{ // event listener on all the items icons stored in item
    element.addEventListener('click', markComplete) // on click, call back markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ // event listener on all the completed items icons stored in itemCompleted
    element.addEventListener('click', markUnComplete) // on click, call back markUnComplete function
})

async function deleteItem(){ // declaring asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText // store the list item from the DOM in itemText
    try{ // error handling with catch statement below
        const response = await fetch('deleteItem', { // awaiting the promise returned from fetch calling the deleteItem function
            method: 'delete', // setting the http method on the request to delete
            headers: {'Content-Type': 'application/json'}, // setting the headers with the json content type
            body: JSON.stringify({     // body of the request sent as json
              'itemFromJS': itemText   // passing stored item in itemText through as json
            })
          })
        const data = await response.json() // awaiting the delete request's response from the server and storing it as json
        console.log(data) // log the json data
        location.reload() // reload the page

    }catch(err){ // if deleteItem fails
        console.log(err) // log the error
    }
}

async function markComplete(){ // similar to above but using put method
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

async function markUnComplete(){ // similar to above but using put method
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
