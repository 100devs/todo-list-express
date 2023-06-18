const deleteBtn = document.querySelectorAll('.fa-trash') // grabs all the delete btn from dom and puts it in an array
const item = document.querySelectorAll('.item span') // grabs all the text content and puts it in an array 
const itemCompleted = document.querySelectorAll('.item span.completed') // grabs all the text content which is marked complete and puts it in an array

Array.from(deleteBtn).forEach((element)=>{ // loops through all the deletebutton
    element.addEventListener('click', deleteItem) // adds event listener to the delete button that runs deleteItem function
})

Array.from(item).forEach((element)=>{ // loops through all the item text
    element.addEventListener('click', markComplete) // adds event listener to the text that runs the markcomplete function
})

Array.from(itemCompleted).forEach((element)=>{ // loops through all the item text thats marked complete
    element.addEventListener('click', markUnComplete) // adds event listener to the texts marked complete that runs the markuncomplete element
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text content related to the delete button
    try{ // runs if text extraction is successful
        const response = await fetch('deleteItem', { // makes a fetch request to the server to the /deleteItem route, sends the options second parameter that contains the details about the request
            method: 'delete', // indicates the type of request. default is get
            headers: {'Content-Type': 'application/json'}, // tells the server what type of data being sent to the server. header is used to indicate additional info about the request
            body: JSON.stringify({ // body contains the data from dom. stringyfy method converts the js object to json data before sending
              'itemFromJS': itemText // assigns the text value to the variable and sends it to the server
            })
          })
        const data = await response.json() // waits for a json response from the server
        console.log(data)// displays the json value in console
        location.reload() // reloads the browser window which makes a new get request 

    }catch(err){ // runs if something goes wrong
        console.log(err) // logs the error
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text content
    try{
        const response = await fetch('markComplete', {// makes a fetch request to the server to the /markComplete route, sends the options second parameter that contains the details about the request
            method: 'put', // sets the request method to put
            headers: {'Content-Type': 'application/json'}, // tells the server what type of data being sent to the server
            body: JSON.stringify({ // contains the data from the dom
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //waits for a json response from the server
        console.log(data) //displays the json value in console
        location.reload() //reloads the browser window which makes a new get request 

    }catch(err){ //runs if something goes wrong
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text content that is marked completed
    try{
        const response = await fetch('markUnComplete', { // makes a fetch request to the server to the /markUnComplete route, sends the options second parameter that contains the details about the request
            method: 'put',// sets the request method to put
            headers: {'Content-Type': 'application/json'}, // tells the server what type of data being sent to the server
            body: JSON.stringify({ // contains the data from the dom
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //waits for a json response from the server
        console.log(data) //displays the json value in console
        location.reload() //reloads the browser window which makes a new get request 

    }catch(err){ //runs if something goes wrong
        console.log(err)
    }
}