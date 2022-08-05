const deleteBtn = document.querySelectorAll('.fa-trash') // Creates a variable holding the the html element with the class of '.fa-trash
const item = document.querySelectorAll('.item span') // Creates a variable holding the the html element span inside the list item 
const itemCompleted = document.querySelectorAll('.item span.completed') // Creates a variable holding the the html element span with the class 'completed' inside the list item 

Array.from(deleteBtn).forEach((element)=>{ // Creates an array for each delete button, and loops over the array
    element.addEventListener('click', deleteItem) // adds an event listener to each element in the array for a click, and when it triggers run the deleteItem function
})

Array.from(item).forEach((element)=>{  // Creates an array for each list item, and loops over the array
    element.addEventListener('click', markComplete) // adds an event listener to each element in the array for a click, and when it triggers run the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ // Creates an array for each list item with the 'completed' class, and loops over the array
    element.addEventListener('click', markUnComplete) // adds an event listener to each element in the array for a click, and when it triggers run the markUnComplete function
})

async function deleteItem(){ // Declares an async function 
    const itemText = this.parentNode.childNodes[1].innerText // Creates a variable and assigns it the inner text of the clicked section
    try{ // Tries to execute the following block of code
        const response = await fetch('deleteItem', { // Creates a variable and assigns it the data it gets from /deleteItem path in the server
            method: 'delete', // Sets teh CRUD the method Delete
            headers: {'Content-Type': 'application/json'}, // gives info about the content-type to be received, in this case JSON
            body: JSON.stringify({ // Declare the message content being passed, and transforms the json file in a string
              'itemFromJS': itemText // Sets the body content to the itemText variable value and names it 'itemFromJs'
            })
          })
        const data = await response.json() // creates a data variable and awaits for the response(json format) to be converted, then assigns it 
        console.log(data) // logs the data returned
        location.reload() // reloads the page 

    }catch(err){ // if the try fails, catches the error
        console.log(err) // logs the weeoe
    }
}

async function markComplete(){ // Declares an async func
    const itemText = this.parentNode.childNodes[1].innerText // creaes a variable a and assigns it the inner text of the node clicked
    try{ // tries to run this code block
        const response = await fetch('markComplete', { // / Creates a variable and assigns it the data it gets from /markComplete path in the server
            method: 'put', // Sets the CRUD method Put, or Update
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

async function markUnComplete(){
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