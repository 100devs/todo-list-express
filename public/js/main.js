//get references to all the delete buttons 
const deleteBtn = document.querySelectorAll('.fa-trash')
// get references to all the spans that are children of class "item"
const item = document.querySelectorAll('.item span')
// get references to all the spans that are children of class "item", with class "complete"
//ie, the completed items
const itemCompleted = document.querySelectorAll('.item span.completed')

//make an array of all the delete buttons
//then run the below code for each one
Array.from(deleteBtn).forEach((element)=>{
    //add event listeners on each button
    //when the element is clicked, run the "deleteItem" function
    element.addEventListener('click', deleteItem)
})

//make an array of all the "items"
//then run the below code for each one
Array.from(item).forEach((element)=>{
    //add event listeners on each item
    //when the element is clicked, run the "markComplete" function
    element.addEventListener('click', markComplete)
})

//make an array of all the complete items
//then run the below code for each one
Array.from(itemCompleted).forEach((element)=>{
    // add event listeners on each complete item
    // when the element is clicked, run the "markUnComplete" function
    element.addEventListener('click', markUnComplete)
})

//an async function for deleting items
async function deleteItem(){
    //get the text of the item this function was called on
    const itemText = this.parentNode.childNodes[1].innerText
    //attempt to run the following code
    try{
        //send a request to [bseURL]/deleteItem
        const response = await fetch('deleteItem', {
            //specify the HTTP request type - delete
            method: 'delete',
            //add a header to say we're sending json
            headers: {'Content-Type': 'application/json'},
            //in the body of the request, turn the object into JSON
            body: JSON.stringify({
                //set the "itemFromJS" property to equal the text of the item
              'itemFromJS': itemText
            })
          })
        //once the data has been retrieved, parse it from json to a JS object
        const data = await response.json()
        // log the data to the console
        console.log(data)
        //reload the page
        location.reload()

    // if there is an error, print it to the console
    }catch(err){
        console.log(err)
    }
}

//aync function to mark an item as complete
async function markComplete(){
    //get the text of the item this function was called on
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //send a request to [baseURL]/markComplete
        const response = await fetch('markComplete', {
            //specify the HTTP request type - put, ie update
            method: 'put',
            //add a header to say we're sending json
            headers: {'Content-Type': 'application/json'},
            //in the body of the request, turn the object into JSON
            body: JSON.stringify({
                //set the "itemFromJS" property to equal the text of the item
                'itemFromJS': itemText
            })
          })
        //once the data has been retrieved, parse it from json to a JS object
        const data = await response.json()
        // log the data to the console
        console.log(data)
        //reload the page
        location.reload()

    // if there is an error, print it to the console
    }catch(err){
        console.log(err)
    }
}

//async function to mark an item as incomplete/"uncomplete"
async function markUnComplete(){
    //get the text of the item this function was called on
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //send a request to [baseURL]/markUnComplete
        const response = await fetch('markUnComplete', {
            //specify the HTTP request type - put, ie update
            method: 'put',
            //add a header to say we're sending json
            headers: {'Content-Type': 'application/json'},
            //in the body of the request, turn the object into JSON
            body: JSON.stringify({
                //set the "itemFromJS" property to equal the text of the item
                'itemFromJS': itemText
            })
          })
        //once the data has been retrieved, parse it from json to a JS object
        const data = await response.json()
        // log the data to the console
        console.log(data)
        //reload the page
        location.reload()

    // if there is an error, print it to the console
    }catch(err){
        console.log(err)
    }
}