const deleteBtn = document.querySelectorAll('.fa-trash') //select all the delete buttons
const item = document.querySelectorAll('.item span') //select all the item spans (completed, not completed, and the trash icon)
const itemCompleted = document.querySelectorAll('.item span.completed') //select all the completed items

Array.from(deleteBtn).forEach((element)=>{ //add event listeners to all delete buttons on items. Will call deleteItem function when clicked.
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // add event listeners to all todo list items (spans). when clicked will call the markComplete function.
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ //add event listeners to all item completed spans. when clicked will call the markUnComplete function.
    element.addEventListener('click', markUnComplete)
})

//Client side delete item function that asks server.js to delete the item. It's called by an event listener on the trash icon.
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text from the item span (completed or uncompleted)
    try{// catch any errors in the {}
        const response = await fetch('deleteItem', { //call the deleteItem function on server.js and send over relevant data
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // save the json response in a constant called data
        console.log(data)// log the data that was returned to the console
        location.reload()// reload the page to show the changed todo list

    }catch(err){// if any errors caught, log them to the console
        console.log(err)
    }
}

//Client side function to mark items complete. calls the server side markComplete method. Called from event listener on item spans
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{// catch any errors in the {}
        const response = await fetch('markComplete', {//call the markComplete function on server.js and send relevant data
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//save the json response in a constant called data
        console.log(data)//log the data that was returned to the console
        location.reload()//reload the page to show the changes made

    }catch(err){// if any errors caught, log them to the console
        console.log(err)
    }
}

//Client side function to mark items not complete. calls the server side markUnComplete method. Called from event listener on completed item spans
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{// catch any errors in the {}
        const response = await fetch('markUnComplete', {//call the markUnComplete function on server.js and send relevant data
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//save the json response in a constant called data
        console.log(data)//log the data that was returned to the console
        location.reload()//reload the page to show the changes made

    }catch(err){// if any errors caught, log them to the console
        console.log(err)
    }
}