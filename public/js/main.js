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
    // Creates a constant variable named "itemText" that targets the first (I think) child node in the DOM of the ejs file; runs innerText method when deleteItem function is called on child node.
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

// Creates a function named markComplete that marks an item as complete on MongoDB and UI
async function markComplete(){
    // Creates a constant variable named "itemText" that targets the first (I think) child node in the DOM of the ejs file; runs innerText method when markComplete function is called on child node.
    const itemText = this.parentNode.childNodes[1].innerText
     // Tries the method to see if it will work; if not, then catch function will run
    try{
        // awaits a response from the markComplete function 
        const response = await fetch('markComplete', {
            // Responsible for telling the database to put a mark near the completed item
            method: 'put',
            // Lets program know the type of file  to expect so that it can render correctly; if this is not done, application will, in most cases,crash.
            headers: {'Content-Type': 'application/json'},
            // Converts JSON response in to a string
            body: JSON.stringify({
                 // This is what is being converted in to a string; the value from "itemsFromJS" along with the pair "itemText"- so the item text within the item from JS is being converted in to a string.
                'itemFromJS': itemText
            })
          })
        // Variable defined to signify the result of the promise that will be resolved within this JSON object  
        const data = await response.json()
        // Logs result to the console 
        console.log(data)
        // Automatically reloads the page so that visible changes can be seen on the UI.
        location.reload()

    // Checks for any errors that may have generated   
    }catch(err){
        // Logs errors if there are any present
        console.log(err)
    }
}

// Creates a function named markComplete that marks an item as incomplete on MongoDB and UI.
async function markUnComplete(){
    // Creates a constant variable named "itemText" that targets the first (I think) child node in the DOM of the ejs file; runs innerText method when markComplete function is called on child node.
    const itemText = this.parentNode.childNodes[1].innerText
    // Tries the method to see if it will work; if not, then catch function will run
    try{
        // awaits a response from the markUnComplete function
        const response = await fetch('markUnComplete', {
            // Responsible for telling the database to put a mark near the incompleted item
            method: 'put',
            // Lets program know the type of file  to expect so that it can render correctly; if this is not done, application will, in most cases,crash.
            headers: {'Content-Type': 'application/json'},
            // Converts JSON response in to a string
            body: JSON.stringify({
                // This is what is being converted in to a string; the value from "itemsFromJS" along with the pair "itemText"- so the item text within the item from JS is being converted in to a string.
                'itemFromJS': itemText
            })
          })
        // Variable defined to signify the result of the promise that will be resolved within this JSON object  
        const data = await response.json()
        // Logs result to the console 
        console.log(data)
        // Automatically reloads the page so that visible changes can be seen on the UI.  
        location.reload()
    
    // Logs errors if there are any present    
    }catch(err){
          // Logs errors if there are any present
        console.log(err)
    }
}