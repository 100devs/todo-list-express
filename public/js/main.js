// targeting all DOM elements with the 'fa-trash' class
const deleteBtn = document.querySelectorAll('.fa-trash')
// targeting all DOM elements that are spans that are a child of of the 'item' class
const item = document.querySelectorAll('.item span')
//  targeting all DOM elements that are the class of 'completed' that are children of spans that are children of the 'item' class 
const itemCompleted = document.querySelectorAll('.item span.completed')


// create an array fromm the querySelectorAll results, loop through all, and add a 'click' event listener that fires the 'deleteItem' function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// create an array fromm the querySelectorAll results, loop through all, and add a 'click' event listener that fires the 'markComplete' function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// create an array fromm the querySelectorAll results, loop through all, and add a 'click' event listener that fires the 'markUnComplete' function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Asyncronous function 
async function deleteItem(){
    // traverses the DOM up to the partent li and gets the text of the first span element
    const itemText = this.parentNode.childNodes[1].innerText
    // awaits the completion of the delete request
    try{
        const response = await fetch('deleteItem', {
            // sets the method name in the header
            method: 'delete',
            // sets headers to json response
            headers: {'Content-Type': 'application/json'},
            // sends itemText to be deleted
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // sets response to json
        const data = await response.json()
        // logs data in the browser console
        console.log(data)
        // refreshes the page in the browser
        location.reload()
    // returns an error to the console log if an error is returned
    }catch(err){
        console.log(err)
    }
}
// Asyncronous function 
async function markComplete(){
    // traverses the DOM up to the partent li and gets the text of the first span element
    const itemText = this.parentNode.childNodes[1].innerText
    // awaits the completion of the delete request
    try{
        const response = await fetch('markComplete', {
            // sets the method name in the header
            method: 'put',
            // sets headers to json response
            headers: {'Content-Type': 'application/json'},
            // sends itemText to be deleted
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // sets response to json
        const data = await response.json()
        // logs data in the browser console
        console.log(data)
        // refreshes the page in the browser
        location.reload()
    // returns an error to the console log if an error is returned
    }catch(err){
        console.log(err)
    }
}
// Asyncronous function 
async function markUnComplete(){
    // traverses the DOM up to the partent li and gets the text of the first span element
    const itemText = this.parentNode.childNodes[1].innerText
    // awaits the completion of the delete request
    try{
        const response = await fetch('markUnComplete', {
            // sets the method name in the header
            method: 'put',
            // sets headers to json response
            headers: {'Content-Type': 'application/json'},
            // sends itemText to be deleted
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // sets response to json
        const data = await response.json()
        // logs data in the browser console
        console.log(data)
        // refreshes the page in the browser
        location.reload()
    // returns an error to the console log if an error is returned
    }catch(err){
        console.log(err)
    }
}