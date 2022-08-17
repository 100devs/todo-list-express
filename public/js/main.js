
/* Variables that are used to store the HTML elements that we will be using to add event listeners to
1. DeleteBtn selects the svg fa-trash icon
2. item selects the span of that is the child of the .item class
3. itemCompleted selects the span that is the child of the .item class that has the class .completed */
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

/* From the three variable storing the HTML elements data create and array from each of these nodes and add an event
listeners to each of them with a callback function*/
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//Create an async function that will be called every time the deleteBtn element is clicked
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // Selects the parent element of .fa-trash and then selects the first child
    //Try and catch block for the API request
    try{
        /*Creating a response variable that awaits on a fetech from the deleteItem route where the method,
        headers (sent as JSON), and body (the content being sent to the route) are sent*/
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText //Setting the content of the body and will be used on the server side to query the deletion
            })
          })
        const data = await response.json() //Waiting on JSON from the response
        console.log(data) // log data to the console
        location.reload() // Reloads the page
    }catch(err){ /* If there is an error, pass the error to the catch block and log to the console*/
        console.log(err)
    }
}

// Creating as async function that will be called every time the span with the that does not have the class complete is clicked
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // Selects the parent element of .fa-trash and then selects the first child
    //Try and catch block begins
    try{
        /*Creating a response variable that awaits a fetch from the markComplete route on the server side
        the method is an update(put), header type is json, and the body is sending the itemText which will be used as the query*/
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//Waiting on JSON from the response
        console.log(data) // log data to the console
        location.reload() // Reloads the page
    }catch(err){/* If there is an error, pass the error to the catch block and log to the console*/
        console.log(err)
    }
}

//Doing the same thing as above except this time the route is to markUnComplete
//Both these put requests are toggling the complete property between true and false when the span with the li is clicked
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