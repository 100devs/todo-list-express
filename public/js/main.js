//this is the delete button variable that assigns a smirth on the trashcan icon
const deleteBtn = document.querySelectorAll('.fa-trash')
//this is a variable called item that has a smirth on it 
const item = document.querySelectorAll('.item span')
// this variable is assigned so the smirth is on the item span that completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//this goes through each element (list item) in the array
Array.from(deleteBtn).forEach((element)=>{
  //we added a smurf that will listen for the click and it will in return delete the item
    element.addEventListener('click', deleteItem)
})

//this this go through every element in the array
Array.from(item).forEach((element)=>{
//this puts a smurf on element that listens for the click on the item and in return it will mark it complete
    element.addEventListener('click', markComplete)
})
//this will go through each element (item) in the array
Array.from(itemCompleted).forEach((element)=>{
//this puts a smurf to listen to the click and will return the mark uncomplete on the item
    element.addEventListener('click', markUnComplete)
})


//a function to delete an item
async function deleteItem(){
//reference to the item that i clicked in the DOM
    const itemText = this.parentNode.childNodes[1].innerText
//we want this to happen if you click on the item text. 
    try{
//this is a variable to fetch the delete item and respond the following ways
        const response = await fetch('deleteItem', {
          //the method is delete
            method: 'delete',
           //when your browser makes a request to the server, this lets it known the content type of json
            headers: {'Content-Type': 'application/json'},
            //the body is json
            body: JSON.stringify({
            //sends a json object with item 
              'itemFromJS': itemText
            })
          })
    //this is a variable that has the json response
        const data = await response.json()
    //console log the json response
        console.log(data)
    //reloads the page
        location.reload()
//the catch handler catches the errror
    }catch(err){
//console logs the error
        console.log(err)
    }
}
//functin for when you complete a task
async function markComplete(){
//reference to the item that i clicked in the DOM
    const itemText = this.parentNode.childNodes[1].innerText
//try handler if it works
    try{
//the variable response to fetch when the item is marked completed
        const response = await fetch('markComplete', {
           //the method we use is put
            method: 'put',
            //the browser makes the request to the server and itget the json object 
            headers: {'Content-Type': 'application/json'},
        //requesting json from the body
            body: JSON.stringify({
               //sends a joson object 
                'itemFromJS': itemText
            })
          })
        // //this is a variable that has the json response
        const data = await response.json()
       //console log the json response
         console.log(data)
       // /reloads the page
        location.reload()
//the catch handler will return an error if the try catch doesn't work
    }catch(err){
//console logs the error
        console.log(err)
    }
}
//function for marking the item uncomplete 
async function markUnComplete(){
 //reference to the item that i clicked in the DOM
    const itemText = this.parentNode.childNodes[1].innerText
//try handler we want this to work
    try{
    //fetching the response for mark uncomplete
        const response = await fetch('markUnComplete', {
        //the fetch is getting the put method
            method: 'put',
            // //the browser makes the request to the server and itget the json object 
            headers: {'Content-Type': 'application/json'},
              //requesting json from the body
            body: JSON.stringify({
                  //sends a joson object 
                'itemFromJS': itemText
            })
          })
        //this is a variable that has the json response
        const data = await response.json()
    //console logging the data varaible that is the json response from the server
        console.log(data)
        // /reloads the page
        location.reload()
//catch handler is needed if the try catch doesn't work
    }catch(err){
//console logs the error causing it
        console.log(err)
    }
}