const deleteBtn = document.querySelectorAll('.fa-trash') // create a variable and assign it to the delete button
const item = document.querySelectorAll('.item span') // create a variable and assign it to the span tag
const itemCompleted = document.querySelectorAll('.item span.completed') // create a variable and assign it to the span tag with the class completed

Array.from(deleteBtn).forEach((element)=>{ 
    element.addEventListener('click', deleteItem) // add event listener to each delete button  
})

Array.from(item).forEach((element)=>{ // add event listener to each item text
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click and runs the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // add an event listener to the current item that waits for a click and runs the markUnComplete function
})

async function deleteItem(){ // declares an async function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and finds the text inside the span tag
    try{
        const response = await fetch('deleteItem', { // creates a response object that is a promise that is waiting for a response from the server
            method: 'delete', // sets the method to delete
            headers: {'Content-Type': 'application/json'}, // sets the headers to application/json
            body: JSON.stringify({ // sets the body to the itemText variable
              'itemFromJS': itemText // sets the itemFromJS variable to the itemText variable
            })
          })
        const data = await response.json() // creates a data variable that is a promise that is waiting for a response from the server
        console.log(data) // logs the data variable
        location.reload() // reloads the page

    }catch(err){ // if there is an error
        console.log(err) // log the error
    }
}

async function markComplete(){ // declares an async function 
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and finds the text inside the span tag 
    try{ // if there is an error
        const response = await fetch('markComplete', { // creates a response object that is a promise that is waiting for a response from the server
            method: 'put', // sets the method to put
            headers: {'Content-Type': 'application/json'}, // sets the headers to application/json
            body: JSON.stringify({ // sets the body to the itemText variable
                'itemFromJS': itemText // sets the itemFromJS variable to the itemText variable
            }) 
          })
        const data = await response.json() // creates a data variable that is a promise that is waiting for a response from the server
        console.log(data) // logs the data variable
        location.reload() // reloads the page

    }catch(err){ // if there is an error
        console.log(err) // log the error
    }
}

async function markUnComplete(){ // declares an async function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and finds the text inside the span tag
    try{ // if there is an error
        const response = await fetch('markUnComplete', { // creates a response object that is a promise that is waiting for a response from the server
            method: 'put', // sets the method to put
            headers: {'Content-Type': 'application/json'}, // sets the headers to application/json
            body: JSON.stringify({ // sets the body to the itemText variable
                'itemFromJS': itemText // sets the itemFromJS variable to the itemText variable
            }) 
          })
        const data = await response.json() // creates a data variable that is a promise that is waiting for a response from the server
        console.log(data) // logs the data variable
        location.reload() // reloads the page

    }catch(err){ // if there is an error
        console.log(err) // log the error
    }
}