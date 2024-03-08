// Main JS file to define behavior on the browser side of the application

// defining which elements are the 'delete' buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
// defining the todo items in the document
const item = document.querySelectorAll('.item span')
// defining which items are to be marked competed
const itemCompleted = document.querySelectorAll('.item span.completed')

// creating an array from all of the delete buttons and adding an event listener to each element
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// creating an array from all of the items and adding an event listener to each element
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// creating an array from all of the completed items and adding an event listener to each element
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// declaring an asynchronous function called deleteItem
async function deleteItem(){
// defining what text is desired from the element
    const itemText = this.parentNode.childNodes[1].innerText
// Attempt the following code block
    try{
// defining response as a fetch that the browser needs to wait to be fullfilled.
// sending the fetch to the /deleteItem end point that the server is listening for.
        const response = await fetch('deleteItem', {
// HTTP Method: delete
            method: 'delete',
// Telling the server what type of content is being sent
            headers: {'Content-Type': 'application/json'},
// converting the important part of the request into JSON format
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
// Defining a response binding that the fetch is waiting for
        const data = await response.json()
// console loging the response from the server
        console.log(data)
// reloding the change which causes a new get request and the database changes to be displayed on the screen
        location.reload()
// if the above runs into an error the error will be put into the console
    }catch(err){
        console.log(err)
    }
}

// Defining an asynchronous function
async function markComplete(){
// defining a binding for the necessary text from the element
    const itemText = this.parentNode.childNodes[1].innerText
// attempt to do the following code
    try{
// defining a variable as a fetch that the function will need to wait for and the server is listening for
        const response = await fetch('markComplete', {
// http put method which lines up with the servers expectations 
            method: 'put',
// telling the server what type of info is being sent
            headers: {'Content-Type': 'application/json'},
// Converting the body of the request into JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
// What to do with the data that the server responds with
        const data = await response.json()
        console.log(data)
// reloading the page causing a new get request to be sent to the server displaying the new information
        location.reload()
// If the above fails put the error in the console
    }catch(err){
        console.log(err)
    }
}

// defining and asynchronous function
async function markUnComplete(){
// declaring a variable that pulls the necessary text out of the html element
    const itemText = this.parentNode.childNodes[1].innerText
// attempt to run the following code
    try{
// defining resposne as fetch that the function needs to wait for and the server is listening for.
        const response = await fetch('markUnComplete', {
// http put method which matches the serer
            method: 'put',
// defining the type of information that is being sent
            headers: {'Content-Type': 'application/json'},
// converting the body of the request into JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
// defining the respone from the server which the function is waiting for
        const data = await response.json()
// what to do with the response from the server
        console.log(data)
        location.reload()

// If the try block can not be completed put the returned error in the console.
    }catch(err){
        console.log(err)
    }
}