// sets variable for trash can from the DOM
const deleteBtn = document.querySelectorAll('.fa-trash')

// sets variable for item from the DOM
const item = document.querySelectorAll('.item span')

// sets variable for items completed from the DOM
const itemCompleted = document.querySelectorAll('.item span.completed')

//Creates an array from all of the elements in the document that are in the "deleteBtn" array
Array.from(deleteBtn).forEach((element)=>{
  
  //To each item in the array, adds an event listener that, on click, runs the deleteItem function
    element.addEventListener('click', deleteItem)
}) 

//Creates an array from all of the elements in the document that are in the "item" array
Array.from(item).forEach((element)=>{
  
    //To each item in the array, adds an event listener that, on click, runs the markComplete function
    element.addEventListener('click', markComplete)
})

//Creates an array from all of the elements in the document that are in the "itemCompleted" array
Array.from(itemCompleted).forEach((element)=>{
  
    //To each item in the array, adds an event listener that, on click, runs the markUnComplete function
    element.addEventListener('click', markUnComplete)
})

//Declares an asynchronous function called deleteItem that takes no parameters.
async function deleteItem(){

  //Takes the text that is in the second child of the parent element and places it into a variable itemText
    const itemText = this.parentNode.childNodes[1].innerText
  
  //Same as a .then handler, runs this code if the first asynchronous request succeeds.
    try{
      
      //Sends a fetch request to the deleteItem endpoint, with the method of delete, and sends it to the server as a json object, with the property name 'itemFromJS' and the value of the itemText previously grabbed.
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
      
      //Waits for a response from the server, and resolves it as a json, console logs the data, and then reloads the current page.
        const data = await response.json()
        console.log(data)
      
      //Reloads the current page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//Upon completion of task, updates database with task being completed.
async function markComplete(){
  
   //Takes the text that is in the second child of the parent element and places it into a variable itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
      
            //Waits for a response from the server, and resolves it as a json, console logs the data, and then reloads the current page.
        const data = await response.json()
        console.log(data)
        location.reload()
      
        //Reloads data after change has been made on server.
    }catch(err){
      //Errors will be display in console
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
            //Waits for a response from the server, and resolves it as a json, console logs the data, and then reloads the current page.
        const data = await response.json()
        console.log(data)
        location.reload()
      
    //Errors will be display in console
    }catch(err){
        console.log(err)
    }
}