const deleteBtn = document.querySelectorAll('.fa-trash') //Set 'deleteBtn' variable to any .fa-trash class items
const item = document.querySelectorAll('.item span') //set 'item' variable to any '.item span' items
const itemCompleted = document.querySelectorAll('.item span.completed') //set 'itemCompleted' variable to any '.item span.completed' variables

Array.from(deleteBtn).forEach((element)=>{ //Make an array from the items in deleteBtn variable, then forEach item...
    element.addEventListener('click', deleteItem) //add event listener for click that calls 'deleteItem' function
})

Array.from(item).forEach((element)=>{ //Make an array from items in 'item' variable, then forEach item...
    element.addEventListener('click', markComplete) //add event listener for click that calls 'markComplete' function
})

Array.from(itemCompleted).forEach((element)=>{ //Make an array from items in the 'itemCompleted' variable, then for each item...
    element.addEventListener('click', markUnComplete) //add event listener for click that calls 'markComplete' function 
})

async function deleteItem(){ //asynchronus deleteItem function
    const itemText = this.parentNode.childNodes[1].innerText //set itemText variable to the innerText of the item that was clicked on
    try{ //try this code, send errors to .catch
        const response = await fetch('deleteItem', { //call deleteItem from server.js
            method: 'delete', //indicate it is a delete method
            headers: {'Content-Type': 'application/json'}, //inform browser what kind of data to expect
            body: JSON.stringify({ //converts body JS value(s) to JSON string
              'itemFromJS': itemText //set 'itemFromJS' to itemText value
            })
          })
        const data = await response.json() //await response.json from serverside
        console.log(data) //log the response
        location.reload() //reload page

    }catch(err){ //.catch for errors
        console.log(err) //log any errors to console
    }
}

async function markComplete(){ //async markComplete function
    const itemText = this.parentNode.childNodes[1].innerText //set itemText variable to the innerText of the item that was clicked on
    try{  //try this code, send errors to .catch
        const response = await fetch('markComplete', { //fetch 'markComplete' from server.js
            method: 'put', //indicate it is a put (update) method
            headers: {'Content-Type': 'application/json'}, //inform browser what kind of data to expect
            body: JSON.stringify({ //converts body JS value(s) to JSON string
                'itemFromJS': itemText //set 'itemFromJS' to itemText value
            })
          })
        const data = await response.json() //await response.json from server-side
        console.log(data) //log data once response received
        location.reload() //refresh page after this happens

    }catch(err){ //catch any errors
        console.log(err) //log errors to console
    }
}

async function markUnComplete(){ //async mark UnComplete function
    const itemText = this.parentNode.childNodes[1].innerText //set itemText variable to the innerText of the item that was clicked on
    try{ //try this code, send errors to .catch
        const response = await fetch('markUnComplete', { //fetch 'markUnComplete' from server.js
            method: 'put', //indicate it is a put (update) method
            headers: {'Content-Type': 'application/json'}, //inform browser what kind of data to expect
            body: JSON.stringify({ //converts body JS value(s) to JSON string
                'itemFromJS': itemText //set 'itemFromJS' to itemText value
            })
          })
        const data = await response.json() //awaits response.json from server-side
        console.log(data) //log data once response is received
        location.reload() //refresh page after this happens

    }catch(err){ //catch any errors
        console.log(err) //log errors to console
    }
}