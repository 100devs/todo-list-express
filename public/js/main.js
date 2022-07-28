//Get the delete button from the DOM
const deleteBtn = document.querySelectorAll('.fa-trash')
//Get ALL the items span elements from the DOM
const item = document.querySelectorAll('.item span')
//Get ALL the completed items span elements from the DOM
const itemCompleted = document.querySelectorAll('.item span.completed')

//Adds an event listener to all the delete buttons that calls the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//Adds an event listener to all the spans that calls the markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//Adds an event listener to all the completed spans that calls the markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//async function declaration
async function deleteItem(){
    //Get the element's text
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch statement
    try{
        //Make an api requet to /deleteItem using the delete method and send the item's text the user clicked on
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //get the data portion of the response
        const data = await response.json()
        //log it
        console.log(data)
        //reload the document
        location.reload()

    // if there is an error, log it
    }catch(err){
        console.log(err)
    }
}
//async function declaration
async function markComplete(){
     //Get the element's text
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch statement
    try{
        //Make an api requet to /markComplete using the put method and send the item's text the user clicked on
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //get the data portion of the response
        const data = await response.json()
        //log it
        console.log(data)
        //reload the document
        location.reload()

    // if there is an error, log it
    }catch(err){
        console.log(err)
    }
}

//async function declaration
async function markUnComplete(){
    //Get the element's text
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch statement
    try{
        //Make an api requet to /markUnComplete using the put method and send the item's text the user clicked on
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //get the data portion of the response
        const data = await response.json()
        //log it
        console.log(data)
        //reload the document
        location.reload()

     // if there is an error, log it
    }catch(err){
        console.log(err)
    }
}