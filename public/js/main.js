// select all elements with class fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
// select all span elements under the parent element with the class of item
const item = document.querySelectorAll('.item span')
// select all span elements with a class of completed under the parent element with the class of item
const itemCompleted = document.querySelectorAll('.item span.completed')


// an array from elements with class fa-trash
// add a click event listener and use function deleteItem
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
                               
// an array from span elements under the parent element with the class of item,
// add a click event listener and use function markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})


// an array from span elements with a class of completed under the parent element with the class of item
// add a click event listener and use function markUncomplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


// asynchronous function when you click on an element with class fa-trash, trigger function 
async function deleteItem(){
    // variable itemText holds the text of the second child of the parent element
    const itemText = this.parentNode.childNodes[1].innerText
    // .then handler, runs this code if the request is a success
    try{
        // sends a fetch request to server (server.js, app.delete), sends a JSON object with the property name 'itemFromJS' and the value of the itemText
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // after request is complete, data is available, promise resolves into a Response object with useful properties and methods; in this case, resolves as a json
        // console logs the data
        // then reloads the current page
        const data = await response.json()
        console.log(data)
        location.reload()
    // if error, log error on the console
    }catch(err){
        console.log(err)
    }
}

// when you click on an element in the item array, it triggers function to mark task complete
async function markComplete(){
    // variable stores value from the text of the second child of the parent element
    const itemText = this.parentNode.childNodes[1].innerText
    // .then handler, runs this code if the request is a success
    try{
        // sends a fetch request to server (server.js, app.put), sends a JSON object with the property name 'itemFromJS' and the value of the itemText
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // after request is complete, data is available, promise resolves into a Response object with useful properties and methods; in this case, resolves as a json
        // console logs the data
        // then reloads the current page
        const data = await response.json()
        console.log(data)
        location.reload()

    // if there's an error, log the error in the console
    }catch(err){
        console.log(err)
    }
}

// when you click on an element in the item array, it triggers function to mark task uncomplete
async function markUnComplete(){
    // variable stores value from the text of the second child of the parent element
    const itemText = this.parentNode.childNodes[1].innerText
    // .then handler, runs this code if the request is a success
    try{
        // sends a fetch request to server (server.js, app.put), sends a JSON object with the property name 'itemFromJS' and the value of the itemText
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // after request is complete, data is available, promise resolves into a Response object with useful properties and methods; in this case, resolves as a json
        // console logs the data
        // then reloads the current page
        const data = await response.json()
        console.log(data)
        location.reload()

// if there's an error, log the error in the console
    }catch(err){
        console.log(err)
    }
}