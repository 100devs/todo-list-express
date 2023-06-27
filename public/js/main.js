// Variables for the different interactive elements
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Loops through the items adding event listeners to each of the elements
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Function that deletets an item
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // gets inner text from clicked item
    try{
        // sends a re
        const response = await fetch('deleteItem', {  // makes a fetch request to /deleteItem route
            method: 'delete', // type of request
            headers: {'Content-Type': 'application/json'}, // tells server what type of data is being sent
            body: JSON.stringify({ // converts the js object to json data
              'itemFromJS': itemText // assigns the text value to the key itemFromJS and sends it
            })
          })
        const data = await response.json() // waits for a json response
        console.log(data) // displays the response in the console
        location.reload() // reloads the browser

    }catch(err){
        console.log(err) // consoles an error if an error is encountered
    }
}

// Function that marks item as complete
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // gets inner text from clicked item
    try{
        const response = await fetch('markComplete', { // makes a fetch request to /markComplete route
            method: 'put', // type of request
            headers: {'Content-Type': 'application/json'}, // tells server what type of data is being sent
            body: JSON.stringify({ // converts the js object to json data
                'itemFromJS': itemText // assigns the text value to the key itemFromJS and sends it
            })
          })
        const data = await response.json() // waits for a json response
        console.log(data) // displays the response in the console
        location.reload() // reloads the browser

    }catch(err){ 
        console.log(err) // consoles an error if an error is encountered
    }
}

// Function that marks item as uncomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // gets inner text from clicked item
    try{
        const response = await fetch('markUnComplete', { // makes a fetch request to /markUnComplete route
            method: 'put', // type of request
            headers: {'Content-Type': 'application/json'}, // tells server what type of data is being sent
            body: JSON.stringify({ // converts the js object to json data
                'itemFromJS': itemText // assigns the text value to the key itemFromJS and sends it
            })
          })
        const data = await response.json() // waits for a json response
        console.log(data) // displays the response in the console
        location.reload() // reloads the browser

    }catch(err){
        console.log(err) // consoles an error if an error is encountered
    }
}