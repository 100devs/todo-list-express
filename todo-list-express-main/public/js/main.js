// targeting elements with .fa-trash class and assigning variable
const deleteBtn = document.querySelectorAll('.fa-trash')
// targeting elements with span elements with .item class and assigning variable
const item = document.querySelectorAll('.item span')
// targeting elements span elements with .completed class and .item class and assigning variable
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creates array of deleteBtn elements, iterates over each element in array with following function
Array.from(deleteBtn).forEach((element)=>{
//   Adds event listener to all deleteBtn elements to run deleteItem function on click
    element.addEventListener('click', deleteItem)
})

// Creates array of item elements, iterates over each element in array with following function
Array.from(item).forEach((element)=>{
  //   Adds event listener to all item elements to run markComplete function on click
    element.addEventListener('click', markComplete)
})

// Creates array of itemCompleted elements, iterates over each element in array with following function
Array.from(itemCompleted).forEach((element)=>{
  //   Adds event listener to all itemCompleted elements to run markUnComplete function on click
    element.addEventListener('click', markUnComplete)
})

// invoking asynchronous function
async function deleteItem(){
  //new variable pulling text from the first child node of the parent with the class of fa-trash
    const itemText = this.parentNode.childNodes[1].innerText
//     run next await function
    try{
//      Assign variable to store server response from fetch
        const response = await fetch('deleteItem', {
//           make DELETE fetch request
            method: 'delete',
            // header to tell server that its request is in JSON format
            headers: {'Content-Type': 'application/json'},
            // turns item text from item to be deleted into JSON to send
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
//         JSON response stored in data variable
        const data = await response.json()
//         console log data received from server
        console.log(data)
//       refresh page, initiating GET request with updated database documents, which should no longer include deleted item
        location.reload()
// catch any errors that occur
    }catch(err){
      // console log any errors
        console.log(err)
    }
}

// invoking asynchronous function
async function markComplete(){
  //new variable pulling text from the first <span> child node of the parent with the class of item  
    const itemText = this.parentNode.childNodes[1].innerText
    //     run next await function
    try{
      //      Assign variable to store server response from fetch
        const response = await fetch('markComplete', {
//           make PUT fetch request
            method: 'put',
            // request sent as JSON
            headers: {'Content-Type': 'application/json'},
            // sent text in request as JSON string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // JSON response stored in data variable
        const data = await response.json()
        //         console log data received from server
        console.log(data)
//       refresh page, making new GET request, returning new array of documents displaying the clicked item as completed
        location.reload()
// catch any errors that occur
    }catch(err){
            // console log any errors
        console.log(err)
    }
}

// invoking asynchronous function
async function markUnComplete(){
    //new variable pulling text from the first <span> child node of the parent with the class of item and completed
    const itemText = this.parentNode.childNodes[1].innerText
    try{
            //      Assign variable to store server response from fetch
        const response = await fetch('markUnComplete', {
          // PUT method request
            method: 'put',
            // request sent as JSON
            headers: {'Content-Type': 'application/json'},
            // parsing request text and converting to JSON string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // store server response in data variable
        const data = await response.json()
        // console logging all data received in response
        console.log(data)
        // reload current page
        location.reload()
// catch any errors that occur
    }catch(err){
               // console log any errors
        console.log(err)
    }
}