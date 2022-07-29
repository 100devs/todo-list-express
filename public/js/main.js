const deleteBtn = document.querySelectorAll('.fa-trash') // variable to hold all trash icons as querry selectors
const item = document.querySelectorAll('.item span') // variable to hold all spans with the item class as querry selectors
const itemCompleted = document.querySelectorAll('.item span.completed') //variable for spans with item and completed casses as querry selectors

Array.from(deleteBtn).forEach((element)=>{ // select all delete button in array
    element.addEventListener('click', deleteItem) // add click event listener and deleteItem function
})

Array.from(item).forEach((element)=>{ // select all items in array
    element.addEventListener('click', markComplete) // add click event listener and markComplete
})

Array.from(itemCompleted).forEach((element)=>{ // select all items in array
    element.addEventListener('click', markUnComplete) // add click event listener and markUnComplete
})

async function deleteItem(){ // asynconous deleteItem function
    const itemText = this.parentNode.childNodes[1].innerText // variable for holding 1st index of child node of a parent node and add inner text
    try{ // tells function to try this first
        const response = await fetch('deleteItem', { // variable for fetch response from server deleteItem method
            method: 'delete', // states that this is a delete method
            headers: {'Content-Type': 'application/json'}, // sets the content type of the header to json
            body: JSON.stringify({ // sets the body to turn the json to a string
              'itemFromJS': itemText // put item from JS as the item text
            })
          })
        const data = await response.json() // variable holding json info from the server response
        console.log(data) // console logs the response.json
        location.reload() // tell page to refresh

    }catch(err){ // catch function for any errors
        console.log(err) // console log error info
    }
}

async function markComplete(){ // asyncronous markComplete function
    const itemText = this.parentNode.childNodes[1].innerText // variable for holding 1st index of child node of a parent node and add inner text
    try{ // tells function to try this first
        const response = await fetch('markComplete', { // variable for fetch response from server markComplete method
            method: 'put', // states that this is a put method
            headers: {'Content-Type': 'application/json'}, // sets the content type of the header to json
            body: JSON.stringify({ // sets the body to turn the json to a string
                'itemFromJS': itemText // put item from JS as the item text
            })
          })
        const data = await response.json() // variable holding json info from the server response
        console.log(data) // console logs the response.json
        location.reload() // tell page to refresh

    }catch(err){ // catch function for any errors
        console.log(err) // console log error info
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // variable for holding 1st index of child node of a parent node and add inner text
    try{ // tells function to try this first
        const response = await fetch('markUnComplete', { // variable for fetch response from server markUnComplete method
            method: 'put', // states that this is a put method
            headers: {'Content-Type': 'application/json'}, // sets the content type of the header to json
            body: JSON.stringify({ // sets the body to turn the json to a string
                'itemFromJS': itemText // put item from JS as the item text
            })
          })
        const data = await response.json() // variable holding json info from the server response
        console.log(data) // console logs the response.json
        location.reload() // tell page to refresh

    }catch(err){ // catch function for any errors
        console.log(err) // console log error info
    }
}