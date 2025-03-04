const deleteBtn = document.querySelectorAll('.fa-trash') //select all elements with a trashcan item and store them in a variable
const item = document.querySelectorAll('.item span') //select all spans that are general children of item class and store them in a variable
const itemCompleted = document.querySelectorAll('.item span.completed') //select all the spans with the completed class and store them in a variable

Array.from(deleteBtn).forEach((element)=>{ //loop through all spans with a delete variable and give them an event listener that runs a deleteItem function
    element.addEventListener('click', deleteItem) //add a click event and the ability to run the delete function
})

Array.from(item).forEach((element)=>{ //loop through all todo items 
    element.addEventListener('click', markComplete) //add a click event listener to run a markComplete function to all todo items
})

Array.from(itemCompleted).forEach((element)=>{ //loop through all items that are marked as compelte
    element.addEventListener('click', markUnComplete) //add a click event listener to run a markUnComplete function
})

async function deleteItem(){ //declare an asyncronoys function caleld by the event listener
    const itemText = this.parentNode.childNodes[1].innerText //grab the todo text by using the child node and the span name
    try{
        const response = await fetch('deleteItem', { //make a fetch using the route deleteItem
            method: 'delete', //perform a delete request
            headers: {'Content-Type': 'application/json'}, //set up the content type as json
            body: JSON.stringify({ //get the request ready as a json string
              'itemFromJS': itemText //send the todo item with the request with a property of itemFromJS
            })
          })
        const data = await response.json() //grab the response and store it as data
        console.log(data) //log to the console the data it grabbed from the server response
        location.reload() //reload the page triggering the root get https requests allowing us to see the change from this event listener function

    }catch(err){ //listen for any errors
        console.log(err) //when an error is heard log to the console the error msg
    }
}

async function markComplete(){ //set up an asyncronous function called by the event listener
    const itemText = this.parentNode.childNodes[1].innerText //grab the todo text by using the child node
    try{
        const response = await fetch('markComplete', { //make a fetch using the route markComplete
            method: 'put', //create an update request
            headers: {'Content-Type': 'application/json'},  //set the content type as json
            body: JSON.stringify({ //get the request ready as a json string
                'itemFromJS': itemText //send the todo item with the request with a property of itemFromJS
            })
          })
        const data = await response.json() //grab the response and store it as data
        console.log(data) //log to the console the data it grabbed from the server response
        location.reload() //reload the page triggering the root get http request allowing us to see the change from this event listener function

    }catch(err){ //listen for any errors
        console.log(err) //when an error is heard log to the console the error msg
    }
}

async function markUnComplete(){ //declare an asyncronous function that will be run by an even listener
    const itemText = this.parentNode.childNodes[1].innerText //grab the todo text from the span in the ejs file using the parentNode selector and store it in a variable
    try{
        const response = await fetch('markUnComplete', { //make a fetch request using the markUnComplete route
            method: 'put', //set up the update http method
            headers: {'Content-Type': 'application/json'}, //set up the content type as json
            body: JSON.stringify({ //get the request ready as a json string
                'itemFromJS': itemText //send the todo item with the request as an object with the property of itemFromJS
            })
          })
        const data = await response.json() //wait for the server response and store the response as data
        console.log(data) //log the data response from the server to the console
        location.reload() //reload the page triggering a get request for the root directory

    }catch(err){ //listen for any errors
        console.log(err) //log the error to the console.
    }
}