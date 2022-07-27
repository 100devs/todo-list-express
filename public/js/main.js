// querys the dom to find all elements with classes of fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
// querys the document for all the elements that have the class .item and are a span element 
const item = document.querySelectorAll('.item span')
// queryies the document for all elements that have the class of item are a span element and and have the completed class
const itemCompleted = document.querySelectorAll('.item span.completed')

// creates an array from all elements in the deletebtn var and then uses for each to loop over the list
Array.from(deleteBtn).forEach((element)=>{
    // adds an click event listener and function callback to each item
    element.addEventListener('click', deleteItem)
})
// creates an array from all elements in the item var and then uses for each to loop over the list
Array.from(item).forEach((element)=>{
    // adds an click event listener and function callback to each item
    element.addEventListener('click', markComplete)
})
// creates an array from all elements in the itemcompleted var and then uses for each to loop over the list
Array.from(itemCompleted).forEach((element)=>{
    // adds an click event listener and function callback to each item
    element.addEventListener('click', markUnComplete)
})

// declares an async function for deleting an item
async function deleteItem(){
    // sets item text using the this context to find the element clicked then goes to its parentNode and down that parents childrne and extracts the text
    const itemText = this.parentNode.childNodes[1].innerText
    // try syntax to catch any errors during the following code execution
    try{
        // waits and uses the fethc api to place a delete request on the deleteItem path
        const response = await fetch('deleteItem', {
            // sets method of request
            method: 'delete',
            // sets requests content type to be application or json
            headers: {'Content-Type': 'application/json'},
            // sets the body of the request from a js object to a json string
            body: JSON.stringify({
                // declares the itemfromjs key to have the value of itemText above
              'itemFromJS': itemText
            })
          })
        //   sets the promise returned from turning the response from the fetch above into a json
        const data = await response.json()
        // console logs the data in json format
        console.log(data)
        // tells the client to reload at the current location
        location.reload()
    //   catches any errors from the above try block
    }catch(err){
        // console logs the error
        console.log(err)
    }
}
// declares an async function for marking an item complete 
async function markComplete(){
    // sets item text using the this context to find the element clicked then goes to its parentNode and down that parents childrne and extracts the text
    const itemText = this.parentNode.childNodes[1].innerText
    // try syntax to catch any errors during the following code execution
    try{
        // waits and uses the fethc api to place a put request on the markcomplete path
        const response = await fetch('markComplete', {
            // sets method of request
            method: 'put',
            // sets requests content type to be application or json
            headers: {'Content-Type': 'application/json'},
            // sets the body of the request from a js object to a json string
            body: JSON.stringify({
                // declares the itemfromjs key to have the value of itemText above
                'itemFromJS': itemText
            })
          })
        //   sets the promise returned from turning the response from the fetch above into a json
        const data = await response.json()
        // console logs the data in json format
        console.log(data)
        // tells the client to reload at the current location
        location.reload()
    //   catches any errors from the above try block
    }catch(err){
        // console logs the error
        console.log(err)
    }
}
// declares an async function for marking an item uncomplete 
async function markUnComplete(){
    // sets item text using the this context to find the element clicked then goes to its parentNode and down that parents childrne and extracts the text
    const itemText = this.parentNode.childNodes[1].innerText
    // try syntax to catch any errors during the following code execution
    try{
        // waits and uses the fethc api to place a put request on the markcomplete path
        const response = await fetch('markUnComplete', {
            // sets method of request
            method: 'put',
            // sets requests content type to be application or json
            headers: {'Content-Type': 'application/json'},
            // sets the body of the request from a js object to a json string
            body: JSON.stringify({
                // declares the itemfromjs key to have the value of itemText above
                'itemFromJS': itemText
            })
          })
        //   sets the promise returned from turning the response from the fetch above into a json
        const data = await response.json()
        // console logs the data in json format
        console.log(data)
        // tells the client to reload at the current location
        location.reload()
    //   catches any errors from the above try block
    }catch(err){
        // console logs the error
        console.log(err)
    }
}