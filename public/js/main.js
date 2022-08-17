const deleteBtn = document.querySelectorAll('.fa-trash') // selects the fa-trash element and sets it to deleteBtn
const item = document.querySelectorAll('.item span') // selects the item span class element and sets it to item
const itemCompleted = document.querySelectorAll('.item span.completed') // selects the item span.completed class element and sets it to itemCompleted

Array.from(deleteBtn).forEach((element)=>{ // add event listener to delete button, create an array of all delete buttons
    element.addEventListener('click', deleteItem) // add event listener to each delete button
})

Array.from(item).forEach((element)=>{ // add event listener to item, create an array of all items
    element.addEventListener('click', markComplete) // add event listener to each item to mark complete when clicked
})

Array.from(itemCompleted).forEach((element)=>{ //add event listener to itemCompleted, create an array of all items
    element.addEventListener('click', markUnComplete) // add event listener to each item to mark uncomplete when clicked
})

async function deleteItem(){ //delete item from list
    const itemText = this.parentNode.childNodes[1].innerText //get item from list item
    try{ //try to delete this item
        const response = await fetch('deleteItem', { //send the item text to server
            method: 'delete', // send delete request to server
            headers: {'Content-Type': 'application/json'}, // set content type to json
            // converts stuff from innertext into JSON
            body: JSON.stringify({ // send item text to server
              'itemFromJS': itemText // send item text to server
            })
          })
        const data = await response.json() //get response from server
        console.log(data) //log response from server
        location.reload() // reload page
// return an error with catch
    }catch(err){ //if error, log error
        console.log(err) //log error
    }
}

async function markComplete(){ // mark item as complete
    const itemText = this.parentNode.childNodes[1].innerText //get item from list item
    try{ //try to change item to complete
        const response = await fetch('markComplete', { //send the item to server
            method: 'put', //send put request to server
            headers: {'Content-Type': 'application/json'}, //set content type to json
            body: JSON.stringify({ //send item text to server
                'itemFromJS': itemText // send item text to server
            })
          })
        const data = await response.json() // get response from server
        console.log(data) //log reponse from server
        location.reload() //reload page

    }catch(err){ //if error, log error
        console.log(err) // log error
    }
}

async function markUnComplete(){ //mark item as uncomplete
    const itemText = this.parentNode.childNodes[1].innerText // get item from list item
    try{ //try to change item to uncomplete
        const response = await fetch('markUnComplete', { //send the item to server
            method: 'put', // send put request to server
            headers: {'Content-Type': 'application/json'}, // set content type to json
            body: JSON.stringify({ // send item text to server
                'itemFromJS': itemText // send item text to server
            })
          })
        const data = await response.json() // get response from server
        console.log(data) //log response from server
        location.reload() // reload page

    }catch(err){ // if error, log error
        console.log(err) //log error
    }
}