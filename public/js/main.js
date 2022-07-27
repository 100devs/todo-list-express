const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
// querySelectorAll selects all of the nodes with that selector (in this case, class)
// and then pushes them all to a nodelist. We will have three nodelists filled with each type of button
// after these three lines

// adds an event listener to each delete button that calls the deleteItem handler on click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// adds an event listener to each item span that calls the markComplete handler on click
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// adds an event listener to each completed item span that calls the markUnComplete handler on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// this defines the asynchronous handler deleteItem
async function deleteItem(){
    // 'this' refers to the event.target. It selects the sibling of the target node
    // that is second in the nodelist (index 1), then assigns the text content of
    // that node to the variable itemText.
    const itemText = this.parentNode.childNodes[1].innerText
    // enclosed in a try catch block for error handling of async/await
    try{
        // sends a fetch request to the /deleteItem delete route
        // tells the backend that it will be receiving JSON in the body
        // sends the itemText from above to the server as the value of ItemFromJS
        // turns that object into a JSON string to prepare it to be sent to the back end
        // assigns the result of the fetch request to the response variable
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // converts the response to a JavaScript object
        const data = await response.json()
        // console logs this object
        console.log(data)
        // refreshes the page once this is all done
        location.reload()

    }catch(err){
        // if there is an error at any point in the try block, it is console.log()ed
        console.log(err)
    }
}

// defines the markComplete handler

async function markComplete(){
    // 'this' refers to the event.target. It selects the sibling of the target node
    // that is second in the nodelist (index 1), then assigns the text content of
    // that node to the variable itemText.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends a fetch request to the /markComplete put (edit) route
        // tells the backend that it will be receiving JSON in the body
        // sends the itemText from above to the server as the value of ItemFromJS
        // turns that object into a JSON string to prepare it to be sent to the back end
        // assigns the result of the fetch request to the response variable
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // converts the response to a JavaScript object
        const data = await response.json()
        // console logs this object
        console.log(data)
        // refreshes the page once this is all done
        location.reload()

    }catch(err){
        // if there is an error at any point in the try block, it is console.log()ed
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends a fetch request to the /markunComplete put (edit) route
        // tells the backend that it will be receiving JSON in the body
        // sends the itemText from above to the server as the value of ItemFromJS
        // turns that object into a JSON string to prepare it to be sent to the back end
        // assigns the result of the fetch request to the response variable
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // turns that response into a javascript object and assigns it to the data variable
        const data = await response.json()
        // console.log() the data
        console.log(data)
        // refreshes the page
        location.reload()

    }catch(err){
        // if there is an error at any point in the try block, it is console.log()ed
        console.log(err)
    }
}