// Declares unchangeable variable (named 'deleteBtn') of all selectors with the class of ".fa-trash"
const deleteBtn = document.querySelectorAll('.fa-trash')
// Declares unchangeable variable (named 'item') of all selectors with the class names of ".item" and ".span"
const item = document.querySelectorAll('.item span')
// Declares unchangeable variable (named 'itemCompleted') of all selectors with the class names of ".item" and "span.completed"
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creates an array of all selectors from deleteBtn variable and loops through each element whilst waiting for a click event that will delete the item if/when selected.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// Creates an array of all selectors from item variable and loops through each element whilst waiting for a click event that will mark an item complete if/when selected.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// Creates an array of all selectors from itemCompleted variable and loops through each element whilst waiting for a click event that will mark an item not complete if/when selected.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
 
// Creates a function named deleteItem that deletes an item from the task list and MongoDB
async function deleteItem(){
    // Creates a constant variable named "itemText" that targets the second child node in the DOM of the ejs file; runs innerText method when deleteItem function is called on child node.
    const itemText = this.parentNode.childNodes[1].innerText
    // Tries the method to see if it will work; if not, then catch function will run
    try{
        // awaits a response from the deleteItem function 
        const response = await fetch('deleteItem', {
            // Responsible for deleting item from database
            method: 'delete',
            // Lets program know the type of file  to expect so that it can render correctly; if this is not done, application will, in most cases,crash.
            headers: {'Content-Type': 'application/json'},
            // Converts JSON response into a string.
            body: JSON.stringify({
                // This is what is being converted in to a string; the value from "itemsFromJS" along with the pair "itemText"- so the item text within the item from JS is being converted in to a string.
              'itemFromJS': itemText
            })
          })
        // Variable defined to signify the result of the promise that will be resolved within this JSON object
        const data = await response.json()
        // Logs the result to the console
        console.log(data)
        // Automatically reloads the page so that visible changes can be seen on the UI.
        location.reload()
    // Checks for any errors that may have generated      
    }catch(err){
        // Logs errors if there are any present
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
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