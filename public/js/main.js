// declare deleteBtn variable, assign it to all elements in the document that have the class 'fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')
// declare item variable, assign it to all elements in the document that have the are spans inside elements with class 'item'
const item = document.querySelectorAll('.item span')
// declare itemCompleted variable, assign it to all elements in the document that are spans with class 'completed' inside elements with class 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from the elements in deleteBtn
// then loop through it and add an event listener to each element. the deleteItem function will fire upon 'click' event
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// create an array from the elements in item
// then loop through it and add an event listener to each element. the markComplete function will fire upon 'click' event
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// create an array from the elements in itemCompleted
// then loop through it and add an event listener to each element. the markUnComplete function will fire upon 'click' event
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// declare an async function called deleteItem
    // declare itemText variable, assign it to this (where it is called) parentNode's 1st child node's inner text
    // try the following
        // declare variable response, assign it to the following await expression
            // use the fetch function to make a request to the deleteItem endpoint
            // use the DELETE method instead of the default GET request/method
            // sets a request header indicating the request body will be in the json format
            // include the following in the body
                // convert a js value to json format:
                    // object literal: key-value pair of 'itemFromJS': itemText (itemText was previously declared as the inner text of the item to be deleted)
        // declare variable data, asign it to the response converted to json
        // console log that response 
        // reload the page at that location
    // catch error and console log it
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
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

// declare an async function called markComplete
    // declare itemText variable, assign it to this (where it is called) parentNode's 1st child node's inner text
    // try the following
        // declare variable response, assign it to the following await expression
            // use the fetch function to make a request to the markComplete endpoint
            // use the PUT method instead of the default GET request/method. PUT == update
            // sets a request header indicating the request body will be in the json format
            // include the following in the body: 
                // convert a js value to json format:
                    // object literal: key-value pair of 'itemFromJS': itemText (itemText was previously declared as the inner text of the item to be deleted)
        // declare variable data, asign it to the response converted to json
        // console log that response 
        // reload the page at that location
    // catch error and console log it
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

// declare an async function called markUnComplete
    // declare itemText variable, assign it to this (where it is called) parentNode's 1st child node's inner text
    // try the following
        // declare variable response, assign it to the following await expression
            // use the fetch function to make a request to the markUnComplete endpoint
            // use the PUT method instead of the default GET request/method. PUT == update
            // sets a request header indicating the request body will be in the json format
            // include the following in the body: 
                // convert a js value to json format:
                    // object literal: key-value pair of 'itemFromJS': itemText (itemText was previously declared as the inner text of the item to be deleted)
        // declare variable data, asign it to the response converted to json
        // console log that response 
        // reload the page at that location
    // catch error and console log it
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