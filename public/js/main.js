const deleteBtn = document.querySelectorAll('.fa-trash') // points towards our class of '.fa-trash'
const item = document.querySelectorAll('.item span') // points towards our class of '.item span'
const itemCompleted = document.querySelectorAll('.item span.completed') // points towards our class of '.item span.completed'

Array.from(deleteBtn).forEach((element)=>{ // takes the value from deleteBtn
    element.addEventListener('click', deleteItem) // adds an event listener which looks for the click and executes the appropriate callback
})

Array.from(item).forEach((element)=>{ // takes the value from item
    element.addEventListener('click', markComplete) // adds an event listener which looks for the click and executes the appropriate callback
})

Array.from(itemCompleted).forEach((element)=>{ // takes the value from itemCompleted
    element.addEventListener('click', markUnComplete) // adds an event listener which looks for the click and executes the appropriate callback
})

async function deleteItem(){ // asynchronous function which deletes an item
    const itemText = this.parentNode.childNodes[1].innerText // itemText = our first node within DOM, pointing towards innerText
    try{
        const response = await fetch('deleteItem', { 
            method: 'delete', // DELETE request = delete
            headers: {'Content-Type': 'application/json'}, // looks at what data is returned and how to handle it, pointing towards JSON
            body: JSON.stringify({ // transforms JS into JSON
              'itemFromJS': itemText // our itemText value
            })
          })
        const data = await response.json() // JSON response
        console.log(data) // console log what we get returned from the server
        location.reload() // refresh page = GET request

    }catch(err){ // if error
        console.log(err)
    }
}

async function markComplete(){ // function to execute when we mark our task as complete
    const itemText = this.parentNode.childNodes[1].innerText // itemText = innertext of node in our DOM
    try{
        const response = await fetch('markComplete', { 
            method: 'put', // PUT request = update
            headers: {'Content-Type': 'application/json'}, // informs what content is being returned and how to handle it, points towards JSON
            body: JSON.stringify({ // transforms JS to JSON
                'itemFromJS': itemText // sets the 'itemFromJS' to our value
            })
          })
        const data = await response.json() // waiting for our JSON response
        console.log(data) // console log what we get returned
        location.reload() // refresh page

    }catch(err){ // if error
        console.log(err)
    }
}

async function markUnComplete(){ // function for when we uncomplete a task
    const itemText = this.parentNode.childNodes[1].innerText // points towards our node's innertext in DOM
    try{
        const response = await fetch('markUnComplete', { // response will be = 
            method: 'put', // PUT request, update
            headers: {'Content-Type': 'application/json'}, // looks at what data is returned and how to handle it, pointing towards JSON
            body: JSON.stringify({ // transforms JS into JSON
                'itemFromJS': itemText // 'itemFromJS' = our value taken from DOM
            })
          })
        const data = await response.json() // JSON response
        console.log(data) // console log what the server returns
        location.reload() // refresh page = another GET request

    }catch(err){ // if error
        console.log(err)
    }
}