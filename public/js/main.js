// select all elements with the class 'fa-trash' and store them in variable deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
// select all elements with the class 'item span' and store them in variable item
const item = document.querySelectorAll('.item span')
// select all elements with the class 'span.completed' and store them in variable itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed')


//event listeners to selected elements and calls on to functions when clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})



Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//extract text content of the span element's sibling
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        
        //send a delete request to the deleteitem endpoint with the itemText
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //parse the response JSON and log it to the console
        const data = await response.json()
        console.log(data)
        //reload the page after operation
        location.reload()

    }catch(err){
        //log error
        console.log(err)
    }
}

async function markComplete(){
    //extract text content of the span element's sibling, second childNodes
    const itemText = this.parentNode.childNodes[1].innerText
    //wrapped in try-catch block to handle errors that might occur during the asynchronous operations
    try{
        // send a put request to the markcompelte endpoint with the itemText
        const response = await fetch('markComplete', {
            //uses fetch function to send asynchronous PUT request to the markComplete endpoint
            method: 'put',
            //headers indicating JSON content
            headers: {'Content-Type': 'application/json'},
            //body contains item text in JSON format
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //after put request is made, this line parses the JSON response returned by teh server. the parsed data is stored in the 'data' varibale
        const data = await response.json()
        //parse data is then logged in the console
        console.log(data)
        //after completing asynchronous operations, the page is reloaded 
        location.reload()

    }catch(err){
        //log any errors that occurs during the try block (network error or server response error) caught in the catch block and logged into the console
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