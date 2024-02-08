// Grabs all the elements from the dom with class of "fa-trash" and assign them to the deleteBtn variable
const deleteBtn = document.querySelectorAll('.fa-trash')
// Grabs all the elements from the dom with class of "item" and "span" and assign them to the item varible
const item = document.querySelectorAll('.item span')
// Grabs all the elements from the dom with class of "item" and spans with class "completed" and assign it to the "itemCompleted" variable
const itemCompleted = document.querySelectorAll('.item span.completed')

// Turns all the elements in the 'deleteBtn' variable to array and loop over them
Array.from(deleteBtn).forEach((element)=>{
    // Adds eventListener to each item in the deleteBtn array that trigger the deleteItem function with a click
    element.addEventListener('click', deleteItem)
})

// Turns all the elements in the 'item' variable to array and loop over them
Array.from(item).forEach((element)=>{
    // Adds eventListener to each item in the item array that trigger the markComplete function with a click
    element.addEventListener('click', markComplete)
})

// Turns all the elements in the 'item' variable to array and loop over them
Array.from(itemCompleted).forEach((element)=>{
    // Adds eventListener to each item in the itemCompleted that trigger the markComplete function with a click
    element.addEventListener('click', markUnComplete)
})

// An async function that grabs the element text clicked in the dom and sends a delete fetch request to the server to delete the item from the database
async function deleteItem(){
    // The item that is clicked go the parent of that and grab the inner text of the first child and assign it to itemText variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sends a fetch request to the deleteItem route of the server, including the itemText in a json payload and await the response
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Parses the response into json and assign it to data variable and console log it and reloads the web page the will trigger another get request to the server
        const data = await response.json()
        console.log(data)
        location.reload()
    //  Catches any error if occurs during the fetch request and console logs it
    }catch(err){
        console.log(err)
    }
}

// Sends an update request to the markComplete endpoint of the server
async function markComplete(){
    // grabs the item text that is clicked in the DOM and assigns it to the itemText variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sends a request to markComplete endpoint of server, with update method and includes the itemText in a json payload and await the response
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //   Parses the response into json and assign it data variable, console logs it and reloads the web page
        const data = await response.json()
        console.log(data)
        location.reload()
        //   Catches any error if occurs during the fetch request and console logs the error
    }catch(err){
        console.log(err)
    }
}

// Sends an update request to the markUnComplete endpoint of the server
async function markUnComplete(){
    // Grabs the inner text of the item from the dom that is clicked and assign it to itemText variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sends a put request to markUnComplete route of server and includes the itemText in a json payload and await the response
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //   Parses the response into json and assign it to data variable, console logs it and reloads the web page
        const data = await response.json()
        console.log(data)
        location.reload()
        //   Catches any error if occurs during the fetch request and console logs the error
    }catch(err){
        console.log(err)
    }
}