//Declaring variables
const deleteBtn = document.querySelectorAll('.fa-trash') //creating a deleteBtn variable that selects all the elements with the class of 'fa-trash' (trash icon)
const item = document.querySelectorAll('.item span') //creating an item variable that selects all the elements with the class of 'item span'
const itemCompleted = document.querySelectorAll('.item span.completed') //creating an itemCompleted variable that selects all the elements with the class of 'item span.competed'

Array.from(deleteBtn).forEach((element)=>{ //putting all the elements from deleteBtn into an array
    element.addEventListener('click', deleteItem) //adding smurfs to the elements that execute deleteItem function on click
})

Array.from(item).forEach((element)=>{ //putting all the elements from item variable into an array
    element.addEventListener('click', markComplete) //adding smurfs to the elements that execute markComplete function on click
})

Array.from(itemCompleted).forEach((element)=>{ //putting all the elements from itemCompleted variable into an array
    element.addEventListener('click', markUnComplete) //adding smurfs to the elements that execute markUnComplete function on click
})

async function deleteItem(){ //Declaring an asynchronus function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // get text from the span that is clicked and store in variable
    try{ //try block
        const response = await fetch('deleteItem', { //fetch response to delete an item 
            method: 'delete', //method
            headers: {'Content-Type': 'application/json'}, //headers
            body: JSON.stringify({ //convert to JSON
              'itemFromJS': itemText //sending through the body the response to the server
            })
          })
        const data = await response.json() //declaring a variable that contains the response from the server in JSON format
        console.log(data) //logging data
        location.reload() //reloading the page

    }catch(err){ //catching error
        console.log(err) //error message
    }
}

async function markComplete(){ //Declaring an asynchronus function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // get text from the span that is clicked and store in variable
    try{ //try block
        const response = await fetch('markComplete', { //fetch response to update an item
            method: 'put', //put method
            headers: {'Content-Type': 'application/json'}, //headers
            body: JSON.stringify({ //convert to JSON
                'itemFromJS': itemText //sending through the body the response to the server
            })
          })
        const data = await response.json() //declaring a variable that contains the response from the server in JSON format
        console.log(data) //logging data
        location.reload() //reloading the page

    }catch(err){ //catching error
        console.log(err) //error message
    }
}

async function markUnComplete(){ //Declaring an asynchronus function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // get text from the span that is clicked and store in variable
    try{ //try block
        const response = await fetch('markUnComplete', { //fetch response to update an item
            method: 'put', //put method
            headers: {'Content-Type': 'application/json'}, //headers
            body: JSON.stringify({ //convert to JSON
                'itemFromJS': itemText //sending through the body the response to the server
            })
          })
        const data = await response.json() //declaring a variable that contains the response from the server in JSON format
        console.log(data) //logging data
        location.reload() //reloading the page

    }catch(err){ //catching error
        console.log(err) //error message
    }
}